import { prove } from '@plutoxyz/web-proofs'

// Function to initialize the prove process
async function initializeProve() {
  try {
    // Initialize the prove process
    const result = await prove({
      manifestUrl:
        'https://raw.githubusercontent.com/pluto/attest-integrations/refs/heads/main/integrations/reddit-user-karma/manifest.dev.json',
      containerId: 'proveContainer'
    })
    if (result.proof) console.log('Final proof:', result.proof)
    else if (result.error) console.error('Final error:', result.error)
  } catch (error) {
    console.error('Initialization error:', error)
  }
}

initializeProve()
