import { createPublicClient, createWalletClient, custom, encodeFunctionData, getContract, http } from 'viem'
import { baseSepolia } from 'viem/chains'
import contractAbi from './abi.json'

const CONTRACT_ADDRESS = '0x2D386A1ED0a1D21d6E2b68bdFA480944A316B6EA'

let publicClient
let walletClient
function setupClients() {
  publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http()
  })

  // Create a wallet client **only** if window.ethereum is available
  if (typeof window !== 'undefined' && window.ethereum) {
    walletClient = createWalletClient({
      chain: baseSepolia,
      transport: custom(window.ethereum)
    })
  } else {
    walletClient = null
  }

  return { publicClient, walletClient }
}
setupClients()

export function formatTransactionData(proof) {
  console.log('Proof object received:', proof)
  if (
    !proof.digest ||
    !proof.r ||
    !proof.s ||
    proof.v === undefined ||
    !proof.signer ||
    !proof.manifest ||
    !proof.value
  ) {
    throw new Error('Incomplete proof data; one or more fields are missing.')
  }
  // TODO double check structure and
  return {
    digest: proof.digest,
    r: proof.r,
    s: proof.s,
    v: proof.v,
    signer: proof.signer,
    manifest: proof.manifest,
    value: proof.value
  }
}

export async function waitForTransaction(hash) {
  const receipt = await publicClient.waitForTransactionReceipt({ hash })
  return receipt
}

export async function submitProofTx(proofData) {
  if (!walletClient) {
    throw new Error('Wallet client not initialized, no provider found')
  }
  const [address] = await walletClient.requestAddresses()

  const data = encodeFunctionData({
    abi: contractAbi.abi,
    functionName: 'verifyNotarySignature',
    args: [
      proofData.digest,
      proofData.v,
      proofData.r,
      proofData.s,
      proofData.signer,
      proofData.manifest,
      proofData.value
    ]
  })

  // Make sure you're on the correct chain
  await walletClient.switchChain({ id: baseSepolia.id })

  // Send the transaction
  const txHash = await walletClient.sendTransaction({
    account: address,
    to: CONTRACT_ADDRESS,
    data
  })

  console.log('Transaction sent! Hash =', txHash)
  return txHash
}

// 4) Read back the digest to confirm
export async function checkProofDigest() {
  if (!walletClient) {
    throw new Error('Wallet client not initialized, no provider found')
  }
  try {
    const [address] = await walletClient.requestAddresses()

    const contract = getContract({
      address: CONTRACT_ADDRESS,
      abi: contractAbi.abi,
      client: publicClient
    })

    const userDigest = await contract.read.digests([address])
    console.log('Digest for', address, '=', userDigest)

    return userDigest
  } catch (error) {
    throw error
  }
}

export const arrayToHex = (arr) => {
  return '0x' + arr.map((num) => num.toString(16).padStart(2, '0')).join('')
}

export async function submitProofOnChain(proofData) {
  if (!proofData) {
    throw new Error('No proof data provided')
  }

  try {
    // Map and restructure the proof data
    const proofDataUnformatted = {
      digest: proofData.proof.signature.digest,
      v: proofData.proof.signature.signature_v,
      r: proofData.proof.signature.signature_r,
      s: proofData.proof.signature.signature_s,
      signer: proofData.proof.signature.signer,
      manifest: arrayToHex(proofData.proof.data.manifest_hash),
      value: proofData.proof.signature.merkle_leaves[0]
    }

    // Now validate and format the proof data
    const txData = formatTransactionData(proofDataUnformatted)

    // Submit the transaction
    const txHash = await submitProofTx(txData)
    return txHash
  } catch (error) {
    throw error
  }
}

export async function waitForProofConfirmation(txHash) {
  try {
    // Wait for transaction confirmation
    await waitForTransaction(txHash)

    // Check the digest
    const digest = await checkProofDigest()

    return { verified: true, digest }
  } catch (error) {
    throw error
  }
}
