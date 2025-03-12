import React, { useState } from 'react'
import { DEFAULT_PROVER_MODE, Prove } from '@plutoxyz/web-proofs'
import { ProveConfig } from './ProveConfig'
import '../../styles/styles.css'
import { sendProofTx, awaitProofTx } from '../../onchain.js'
import { ErrorMessage } from '../ErrorMessage'
import { SuccessMessage } from '../SuccessMessage'
import { TransactionLink } from '../TransactionLink'

// Define the valid device modes as constants
const DEVICE_MODE_IOS = 'ios'
const DEVICE_MODE_CHROME_EXTENSION = 'chrome-extension'

const App = () => {
  // Add state for proof data and verification
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

  // starting configuration matching ProveProps interface
  const [proveConfig, setProveConfig] = useState({
    manifestUrl:
      'https://raw.githubusercontent.com/pluto/attest-integrations/refs/heads/main/integrations/reddit-user-karma/manifest.dev.json',
    options: {
      preferredDeviceProveMode: DEVICE_MODE_IOS,
      proverMode: DEFAULT_PROVER_MODE,
      developerMode: false,
      extensionEnabled: true,
      showProofResult: true,
      showError: true,
      showLoading: true,
      styles: {
        button: {
          backgroundColor: 'rgba(255, 225, 203, 1)',
          color: '#000000',
          padding: '10px 20px',
          border: 'none'
        },
        qrCodeSize: 192
      }
    },
    callbacks: {
      onLoadingChange: (isLoading) => console.log('Loading:', isLoading),
      onError: (error) => console.error('Error:', error),
      onSuccess: async (result) => {
        console.log('Success:', result)
        setVerifyState({ loading: false, error: null, verified: false, alreadyVerified: false })
        setTxResult({
          txHash: null
        })
        setProofData(result)
      },
      onMobileAppRedirect: () => console.log('Redirecting to mobile app...')
    }
  })

  // Event handler for updating the configuration
  const handleChange = (e) => {
    const { id, type, checked, value } = e.target
    setProveConfig((prev) => {
      const newConfig = { ...prev }

      // Handle nested options
      if (
        [
          'preferredDeviceProveMode',
          'proverMode',
          'extensionEnabled',
          'showProofResult',
          'showError',
          'showLoading'
        ].includes(id)
      ) {
        newConfig.options = {
          ...prev.options,
          [id]: type === 'checkbox' ? checked : value
        }
      }
      // Handle QR code size
      else if (id === 'qrCodeSize') {
        newConfig.options = {
          ...prev.options,
          styles: {
            ...prev.options?.styles,
            qrCodeSize: parseInt(value)
          }
        }
      }
      // Handle manifest URL
      else if (id === 'manifestUrl') {
        newConfig.manifestUrl = value
      }

      return newConfig
    })
  }

  // Add verification function
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
      <ProveConfig config={proveConfig} handleChange={handleChange} />
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
              <SuccessMessage
                verified={verifyState.verified}
                alreadyVerified={verifyState.alreadyVerified}
                hash={txResult?.txHash}
              />
            )}
            {!verifyState.verified && txResult?.txHash ? <TransactionLink hash={txResult?.txHash} /> : null}
          </>
        )}
      </div>
    </div>
  )
}

export default App
