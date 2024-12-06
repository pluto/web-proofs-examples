import React, { useState } from 'react'
import { Prove } from '@plutoxyz/web-proofs'
import '../styles/styles.css'

const App = () => {
  // starting configuration
  const [proveConfig, setProveConfig] = useState({
    manifestUrl:
      'https://raw.githubusercontent.com/pluto/attest-integrations/refs/heads/main/integrations/reddit-user-karma/manifest.dev.json'
  })

  return (
    <div className="container">
      <div className="output">
        <h2>Prove Output</h2>
        <Prove {...proveConfig} />
      </div>
    </div>
  )
}

export default App
