import React, { useState } from 'react'
import { Prove } from '@plutoxyz/web-proofs'
import { sendProofTx, awaitProofTx } from '../onchain.js'
import '../styles/styles.css'
import { ErrorMessage } from './ErrorMessage'
import { SuccessMessage } from './SuccessMessage'
import { TransactionLink } from './TransactionLink'

const App = () => {
  // starting configuration
  const [proofData, setProofData] = useState(null)
  const [txResult, setTxResult] = useState({
    txHash: null
  })
  const [verifyState, setVerifyState] = useState({
    loading: false,
    error: null,
    verified: false,
    alreadyVerified: false
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

    setVerifyState({ loading: true, error: null, verified: false, alreadyVerified: false })
    setTxResult({
      txHash: null
    })

    try {
      // Submit transaction and get hash
      const result = await sendProofTx(proofData)
      setTxResult({
        txHash: result.txHash || null
      })

      // Check for error from sendProofTx
      if (result.error) {
        setVerifyState({
          loading: false,
          error: result.error,
          verified: false,
          alreadyVerified: false
        })
        return
      }

      // Wait for confirmation
      const { verified, error } = await awaitProofTx(result)

      setVerifyState({
        loading: false,
        error: error || null,
        verified,
        alreadyVerified: false
      })
    } catch (err) {
      console.error('Verification failed:', err)
      setVerifyState({
        loading: false,
        error: err.message || 'Failed to verify proof',
        verified: false,
        alreadyVerified: false
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
            {verifyState.verified && (
              <SuccessMessage verified={verifyState.verified} alreadyVerified={verifyState.alreadyVerified} />
            )}
            {txResult?.txHash && <TransactionLink hash={txResult?.txHash} />}
          </>
        )}
      </div>
    </div>
  )
}

export default App
