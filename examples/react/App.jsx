import React, { useState } from 'react'
import { Prove } from '@plutoxyz/web-proofs'
import { submitProofOnChain, waitForProofConfirmation } from '../onchain.js'
import '../styles/styles.css'
import { ErrorMessage } from './ErrorMessage'
import { SuccessMessage } from './SuccessMessage'
import { TransactionLink } from './TransactionLink'

const App = () => {
  // starting configuration
  const [proofData, setProofData] = useState(null)
  const [txHash, setTxHash] = useState(null)
  const [verifyState, setVerifyState] = useState({
    loading: false,
    error: null,
    verified: false
  })
  const [proveConfig] = useState({
    manifestUrl:
      'https://raw.githubusercontent.com/pluto/attest-integrations/refs/heads/main/integrations/reddit-user-karma/manifest.dev.json',
    callbacks: {
      onSuccess: async (result) => {
        setProofData(result)
      }
    }
  })

  const verifyProof = async () => {
    if (!proofData) return

    setVerifyState({ loading: true, error: null, verified: false })
    setTxHash(null)

    try {
      // Submit transaction and get hash
      const txHash = await submitProofOnChain(proofData)
      setTxHash(txHash)

      // Wait for confirmation
      const { verified } = await waitForProofConfirmation(txHash)
      setVerifyState({ loading: false, error: null, verified })
    } catch (err) {
      console.error('Verification failed:', err)
      setVerifyState({
        loading: false,
        error: err.message || 'Failed to verify proof',
        verified: false
      })
    }
  }

  return (
    <div className="container">
      <div className="output">
        <h2>Prove Output</h2>
        <Prove {...proveConfig} />
        {proofData && (
          <>
            {!verifyState.verified && (
              <button onClick={verifyProof} disabled={verifyState.loading}>
                {verifyState.loading ? 'Verifying...' : 'Verify Proof'}
              </button>
            )}

            {verifyState.error && <ErrorMessage error={verifyState.error} />}
            {verifyState.verified && <SuccessMessage />}
            {txHash && <TransactionLink hash={txHash} />}
          </>
        )}
      </div>
    </div>
  )
}

export default App
