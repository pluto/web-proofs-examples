import React, { useState } from 'react'
import { DEFAULT_PROVER_MODE, Prove } from '@plutoxyz/web-proofs'
import { ProveConfig } from './ProveConfig'
import '../../styles/styles.css'

const App = () => {
  // starting configuration matching ProveProps interface
  const [proveConfig, setProveConfig] = useState({
    manifestUrl:
      'https://raw.githubusercontent.com/pluto/attest-integrations/refs/heads/main/integrations/reddit-user-karma/manifest.dev.json',
    options: {
      preferredDeviceProveMode: 'ios',
      proverMode: DEFAULT_PROVER_MODE,
      developerMode: false,
      extensionEnabled: true,
      showProofResult: true,
      showError: true,
      showLoading: true,
      styles: {
        button: {
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: '10px 20px'
        },
        qrCodeSize: 192
      }
    },
    callbacks: {
      onLoadingChange: (isLoading) => console.log('Loading:', isLoading),
      onError: (error) => console.error('Error:', error),
      callbacks: {
        onSuccess: async (result) => {
          console.log('Success:', result)
        }
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

  return (
    <div className="container">
      <ProveConfig config={proveConfig} handleChange={handleChange} />
      <div className="output">
        <h2>Prove Output</h2>
        <Prove {...proveConfig} />
      </div>
    </div>
  )
}

export default App
