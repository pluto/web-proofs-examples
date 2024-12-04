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
      <label htmlFor="defaultQrCodeSize">QR Code Size:</label>
      <input type="number" id="defaultQrCodeSize" value={config.defaultQrCodeSize} onChange={handleChange} />
    </div>
  </div>
)
