import { prove } from '@plutoxyz/web-proofs'
import { submitProofOnChain, waitForProofConfirmation } from '../onchain.js'

let proofData = null
let txHash = null

// Create UI update functions
function updateUI(state) {
  const verifyButton = document.getElementById('verifyButton')
  const loadingText = document.getElementById('loadingText')
  const errorMessage = document.getElementById('errorMessage')
  const successMessage = document.getElementById('successMessage')
  const transactionLink = document.getElementById('transactionLink')

  // Handle verify button
  if (verifyButton) {
    verifyButton.disabled = state.loading
    verifyButton.style.display = state.verified ? 'none' : 'block'
    verifyButton.textContent = state.loading ? 'Verifying...' : 'Verify Proof'
  }

  // Handle loading text
  if (loadingText) {
    loadingText.style.display = state.loading ? 'block' : 'none'
  }

  // Handle error message
  if (errorMessage) {
    errorMessage.style.display = state.error ? 'block' : 'none'
    errorMessage.textContent = state.error || ''
  }

  // Handle success message
  if (successMessage) {
    successMessage.style.display = state.verified ? 'block' : 'none'
  }

  // Handle transaction link
  if (transactionLink && txHash) {
    transactionLink.style.display = 'block'
    transactionLink.href = `https://sepolia.basescan.org/tx/${txHash}`
  }
}

async function verifyProof() {
  if (!proofData) return

  updateUI({ loading: true, error: null, verified: false })

  try {
    // Submit transaction and get hash
    txHash = await submitProofOnChain(proofData)
    updateUI({ loading: true, error: null, verified: false }) // Update UI to show tx link

    // Wait for confirmation
    const { verified } = await waitForProofConfirmation(txHash)
    updateUI({ loading: false, error: null, verified })
  } catch (err) {
    console.error('Verification failed:', err)
    updateUI({
      loading: false,
      error: err.message || 'Failed to verify proof',
      verified: false
    })
  }
}

// Function to initialize the prove process
async function initializeProve() {
  try {
    // Initialize the prove process
    const result = await prove({
      manifestUrl:
        'https://raw.githubusercontent.com/pluto/attest-integrations/refs/heads/main/integrations/reddit-user-karma/manifest.dev.json',
      containerId: 'proveContainer',
      callbacks: {
        onSuccess: (result) => {
          console.log('Success:', result)
          proofData = result.proof['TEE']
          // Show verify button once we have proof
          document.getElementById('verifyButton').style.display = 'block'
        }
      }
    })
    if (result.proof) console.log('Final proof:', result.proof)
    else if (result.error) console.error('Final error:', result.error)
  } catch (error) {
    console.error('Initialization error:', error)
    updateUI({ loading: false, error: error.message, verified: false })
  }
}

// Initialize on load
initializeProve()

// Add click handler for verify button
document.getElementById('verifyButton')?.addEventListener('click', verifyProof)
