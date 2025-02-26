import React from 'react'

export const ProveConfig = ({ config, handleChange }) => (
  <div className="controls">
    <h2>Prove Configuration</h2>

    <div className="input-group">
      <label htmlFor="manifestUrl">Manifest URL:</label>
      <input type="text" id="manifestUrl" value={config.manifestUrl} onChange={handleChange} />
    </div>

    <div className="input-group">
      <label htmlFor="preferredDeviceProveMode">Device Mode:</label>
      <select id="preferredDeviceProveMode" value={config.options?.preferredDeviceProveMode} onChange={handleChange}>
        <option value="ios">iOS</option>
        <option value="chrome-extension">Chrome Extension</option>
      </select>
    </div>

    <div className="input-group">
      <label htmlFor="proverMode">Prover Mode:</label>
      <select id="proverMode" value={config.options?.proverMode} onChange={handleChange}>
        <option value="TEE">TEE</option>
        <option value="Origo">Origo</option>
        <option value="TLSN">TLSN</option>
      </select>
    </div>

    <div className="checkbox-group">
      <label>
        <input
          type="checkbox"
          id="extensionEnabled"
          checked={config.options?.extensionEnabled}
          onChange={handleChange}
        />
        Extension Enabled
      </label>
    </div>

    <div className="checkbox-group">
      <label>
        <input type="checkbox" id="showProofResult" checked={config.options?.showProofResult} onChange={handleChange} />
        Show Proof Result
      </label>
    </div>

    <div className="checkbox-group">
      <label>
        <input type="checkbox" id="showError" checked={config.options?.showError} onChange={handleChange} />
        Show Error
      </label>
    </div>

    <div className="checkbox-group">
      <label>
        <input type="checkbox" id="showLoading" checked={config.options?.showLoading} onChange={handleChange} />
        Show Loading
      </label>
    </div>

    <div className="input-group">
      <label htmlFor="qrCodeSize">QR Code Size:</label>
      <input type="number" id="qrCodeSize" value={config.options?.styles?.qrCodeSize} onChange={handleChange} />
    </div>
  </div>
)
