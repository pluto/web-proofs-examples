import React, { useState } from 'react'
import { Prove, ProveProps } from '@plutoxyz/web-proofs'
import { DEFAULT_CONFIG } from '../config/constants'
import '../styles/styles.css'

const App = () => {
  const [config, setConfig] = useState<Omit<ProveProps, 'callbacks'>>({
    manifestUrl: DEFAULT_CONFIG.manifestUrl,
    preferredDeviceProveMode: DEFAULT_CONFIG.preferredDeviceProveMode,
    proverMode: DEFAULT_CONFIG.defaultProverMode,
    extensionEnabled: DEFAULT_CONFIG.extensionEnabled,
    showProofResult: DEFAULT_CONFIG.showProofResult,
    showError: DEFAULT_CONFIG.showError,
    showLoading: DEFAULT_CONFIG.showLoading,
    qrCodeSize: DEFAULT_CONFIG.defaultQrCodeSize,
    buttonStyle: DEFAULT_CONFIG.buttonStyles
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setConfig((prev) => ({ ...prev, [e.target.id]: value }))
  }

  return (
    <div className="container">
      <div className="controls">
        <h2>Prove Configuration</h2>

        <div className="input-group">
          <label htmlFor="manifestUrl">Manifest URL:</label>
          <input type="text" id="manifestUrl" value={config.manifestUrl} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label htmlFor="preferredDeviceProveMode">Device Mode:</label>
          <select id="preferredDeviceProveMode" value={config.preferredDeviceProveMode} onChange={handleChange}>
            <option value="ios">iOS</option>
            <option value="chrome-extension">Chrome Extension</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="proverMode">Prover Mode:</label>
          <select id="proverMode" value={config.proverMode} onChange={handleChange}>
            <option value="Origo">Origo</option>
            <option value="TLSN">TLSN</option>
          </select>
        </div>

        <div className="checkbox-group">
          <label>
            <input type="checkbox" id="extensionEnabled" checked={config.extensionEnabled} onChange={handleChange} />
            Extension Enabled
          </label>
        </div>

        <div className="checkbox-group">
          <label>
            <input type="checkbox" id="showProofResult" checked={config.showProofResult} onChange={handleChange} />
            Show Proof Result
          </label>
        </div>

        <div className="checkbox-group">
          <label>
            <input type="checkbox" id="showError" checked={config.showError} onChange={handleChange} />
            Show Error
          </label>
        </div>

        <div className="checkbox-group">
          <label>
            <input type="checkbox" id="showLoading" checked={config.showLoading} onChange={handleChange} />
            Show Loading
          </label>
        </div>

        <div className="input-group">
          <label htmlFor="qrCodeSize">QR Code Size:</label>
          <input type="number" id="qrCodeSize" value={config.qrCodeSize} onChange={handleChange} />
        </div>
      </div>

      <div className="output">
        <h2>Prove Output</h2>
        <Prove
          {...config}
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
