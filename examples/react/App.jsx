import React, { useState } from 'react'
import { Prove } from '@plutoxyz/web-proofs'
import { ProveConfig } from './ProveConfig'
import '../styles/styles.css'

const App = () => {
  // starting configuration
  const [proveConfig, setProveConfig] = useState({
    manifestUrl:
      'https://raw.githubusercontent.com/pluto/attest-integrations/refs/heads/main/integrations/reddit-user-karma/manifest.dev.json',
    defaultQrCodeSize: 192,
    defaultProverMode: 'Origo',
    preferredDeviceProveMode: 'ios',
    extensionEnabled: false,
    showProofResult: true,
    showError: true,
    showLoading: true,
    buttonStyles: {
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '10px 20px'
    }
  })

  // Event handler for updating the configuration
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setProveConfig((prev) => ({ ...prev, [e.target.id]: value }))
    console.log('Updated proveConfig:', proveConfig)
  }

  return (
    <div className="container">
      {/* Configuration component to update the prove configuration */}
      <ProveConfig config={proveConfig} handleChange={handleChange} />
      <div className="output">
        <h2>Prove Output</h2>
        <Prove
          {...proveConfig}
          // Event handlers for the prove process for debugging
          onLoadingChange={(loading) => console.log('Loading:', loading)}
          onError={(error) => console.error('Error:', error)}
          onSuccess={(result) => console.log('Success:', result)}
          onMobileAppRedirect={() => console.log('Redirecting to mobile app...')}
        />
      </div>
    </div>
  )
}

export default App
