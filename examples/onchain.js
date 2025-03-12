import { createPublicClient, createWalletClient, custom, encodeFunctionData, getContract, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import contractAbi from './abi.json'
import {
  validateBytes32,
  extractTransactionHash,
  extractErrorMessage,
  arrayToHex,
  formatProofData,
  validateAndFormatTransactionData
} from './onchainUtility'

const CONTRACT_ADDRESS = '0x2D386A1ED0a1D21d6E2b68bdFA480944A316B6EA'

let publicClient
let walletClient
function setupClients() {
  publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http()
  })

  if (typeof window !== 'undefined') {
    const ethereum = window['ethereum']
    if (ethereum) {
      walletClient = createWalletClient({
        chain: baseSepolia,
        transport: custom(ethereum)
      })
    } else {
      walletClient = null
    }
  } else {
    walletClient = null
  }

  return { publicClient, walletClient }
}

setupClients()

export async function waitForTransaction(hash) {
  if (hash === null) {
    throw new Error('No transaction hash provided, skipping transaction receipt check')
  }

  const hashToUse = extractTransactionHash(hash)

  if (hashToUse === null) {
    throw new Error('No valid transaction hash provided after extraction, skipping transaction receipt check')
  }

  console.log('Waiting for transaction receipt for hash:', hashToUse)
  try {
    const receipt = await publicClient?.waitForTransactionReceipt({ hash: hashToUse })
    console.log('Transaction receipt received:', receipt)

    return receipt
  } catch (error) {
    throw error
  }
}

export async function submitProofTx(proofData) {
  if (!walletClient) {
    throw new Error('Wallet client not initialized, no provider found')
  }
  const [address] = await walletClient.requestAddresses()

  console.log('Submitting proof with data:', proofData)
  // Ensure all values are properly formatted
  const args = [
    proofData.digest,
    Number(proofData.v), // Ensure v is a number
    proofData.r,
    proofData.s,
    proofData.signer,
    proofData.manifest,
    proofData.value
  ]

  const data = encodeFunctionData({
    abi: contractAbi.abi,
    functionName: 'verifyNotarySignature',
    args
  })

  // Make sure you're on the correct chain
  await walletClient.switchChain({ id: baseSepolia.id })

  try {
    // Simulate the transaction before sending it; only way to get revert reason  https://viem.sh/docs/contract/simulateContract#simulatecontract
    try {
      const result = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS,
        abi: contractAbi.abi,
        functionName: 'verifyNotarySignature',
        args,
        account: address
      })
    } catch (simulationError) {
      console.error(simulationError)
      throw simulationError
    }

    // Send the transaction
    const txHash = await walletClient.sendTransaction({
      account: address,
      to: CONTRACT_ADDRESS,
      data
    })

    // Ensure txHash is a string
    const txHashString = typeof txHash === 'object' ? txHash.toString() : txHash

    console.log('Transaction sent! Hash =', txHashString)
    return txHashString
  } catch (error) {
    throw error
  }
}

// New simplified sendProofTx function
export async function sendProofTx(proofData) {
  try {
    if (!proofData) {
      throw new Error('No proof data provided')
    }

    // Format the proof data
    const formattedProof = formatProofData(proofData)

    // Validate and prepare transaction data
    const txData = validateAndFormatTransactionData(formattedProof)

    // Submit the transaction
    const txHash = await submitProofTx(txData)

    return {
      txHash,
      digest: formattedProof.digest
    }
  } catch (error) {
    console.error(error)
    return {
      error: error.toString(),
      digest: proofData?.proof?.signature?.digest || null
    }
  }
}

// New simplified awaitProofTx function
export async function awaitProofTx(txResult) {
  try {
    // Handle error case from sendProofTx
    if (txResult.error) {
      return {
        verified: false,
        error: txResult.error,
        simulationError: txResult.error
      }
    }

    // Extract transaction hash
    const txHash = typeof txResult === 'object' && txResult.txHash ? txResult.txHash : txResult

    if (!txHash) {
      return {
        verified: false,
        error: 'No transaction hash provided'
      }
    }

    // Wait for transaction receipt
    const receipt = await waitForTransaction(txHash)
    console.log('Transaction receipt:', receipt)

    // Check if transaction was successful
    if (!receipt?.status || receipt?.status === 'reverted') {
      return {
        verified: false,
        error: 'Transaction reverted. Failed to verify proof onchain.'
      }
    }

    const verified = receipt?.status === 'success'

    return {
      verified,
      receipt,
      txHash
    }
  } catch (error) {
    console.error('Error in awaitProofTx:', error)
    return {
      verified: false,
      error: error.toString()
    }
  }
}
