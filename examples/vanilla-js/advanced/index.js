import { prove } from '@plutoxyz/web-proofs'
import { sendProofTx, awaitProofTx } from '../../onchain.js'

// Default configuration values
const PROVE_CONFIG = {
  manifestUrl:
    'https://raw.githubusercontent.com/pluto/attest-integrations/refs/heads/main/integrations/reddit-user-karma/manifest.dev.json',
  options: {
    extensionEnabled: true,
    showProofResult: true,
    showError: true,
    showLoading: true
  }
}

// State variables for verification
let proofData = null
let txHash = null

// Helper function to get the value of an input element or fallback to a default value
const getValueOrDefault = (id, fallback, parser = (val) => val) => {
  const element = document.getElementById(id)
  if (!element) return fallback
  if (element.type === 'checkbox') return element.checked || fallback
  return parser(element.value || fallback)
}

// Create UI update functions for verification
function updateUI(state) {
  const verifyButton = document.getElementById('verifyButton')
  const loadingText = document.getElementById('loadingText')
  const errorMessage = document.getElementById('errorMessage')
  const successMessage = document.getElementById('successMessage')
  const transactionLink = document.getElementById('transactionLink')
  const transactionLinkContainer = document.querySelector('.transaction-link')

  // Handle verify button
  if (verifyButton) {
    verifyButton.disabled = state.loading
    verifyButton.style.display = state.verified ? 'none' : proofData ? 'block' : 'none'
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
  if (transactionLink && transactionLinkContainer && txHash) {
    transactionLinkContainer.style.display = 'block'
    transactionLink.href = `https://sepolia.basescan.org/tx/${txHash}`
  } else if (transactionLinkContainer) {
    transactionLinkContainer.style.display = 'none'
  }
}

// Verification function
async function verifyProof() {
  if (!proofData) return

  // Reset UI state
  txHash = null
  updateUI({ loading: true, error: null, verified: false })

  try {
    // Submit transaction and get hash
    const result = await sendProofTx(proofData)

    // Store transaction hash
    if (result.txHash) {
      txHash = result.txHash
      // Update UI to show tx link
      updateUI({ loading: true, error: null, verified: false })
    }

    // Check for error from sendProofTx
    if (result.error) {
      updateUI({
        loading: false,
        error: result.error,
        verified: false
      })
      return
    }

    // Wait for confirmation
    const { verified, error } = await awaitProofTx(result)

    updateUI({
      loading: false,
      error: error || null,
      verified
    })
  } catch (err) {
    console.error('Verification failed:', err)
    updateUI({
      loading: false,
      error: err.message || 'Failed to verify proof',
      verified: false
    })
  }
}

const getProveConfig = () => ({
  manifestUrl: getValueOrDefault('manifestUrl', PROVE_CONFIG.manifestUrl),
  containerId: 'proveContainer',

  options: {
    preferredDeviceProveMode: getValueOrDefault('deviceMode', PROVE_CONFIG.preferredDeviceProveMode),
    proverMode: getValueOrDefault('proverMode', PROVE_CONFIG.defaultProverMode),
    extensionEnabled: getValueOrDefault('extensionEnabled', PROVE_CONFIG.extensionEnabled),
    showProofResult: getValueOrDefault('showProofResult', PROVE_CONFIG.showProofResult),
    showError: getValueOrDefault('showError', PROVE_CONFIG.showError),
    showLoading: getValueOrDefault('showLoading', PROVE_CONFIG.showLoading),
    qrCodeSize: getValueOrDefault('qrCodeSize', PROVE_CONFIG.defaultQrCodeSize, parseInt),
    styles: {
      button: PROVE_CONFIG.buttonStyles
    }
  },
  // use these callbacks to get values from the proof process
  callbacks: {
    onLoadingChange: (isLoading) => {
      const container = document.getElementById('proveContainer')
      if (container) container.classList.toggle('loading', isLoading)
    },
    onError: (error) => console.error('Error:', error),
    onSuccess: (result) => {
      console.log('Success:', result)
      proofData = result
      // Show verify button once we have proof
      updateUI({ loading: false, error: null, verified: false })
    },
    onMobileAppRedirect: () => console.log('Redirecting to mobile app...')
  }
})

// Function to initialize the prove process
async function initializeProve() {
  try {
    // Reset state
    proofData = null
    txHash = null
    updateUI({ loading: false, error: null, verified: false })

    // Initialize the prove process
    const result = await prove(getProveConfig())
    if (result.proof) console.log('Final proof:', result.proof)
    else if (result.error) console.error('Final error:', result.error)
  } catch (error) {
    console.error('Initialization error:', error)
    updateUI({ loading: false, error: error.message, verified: false })
  }
}

// Add an event listener to the update button
document.getElementById('updateConfig')?.addEventListener('click', initializeProve)

// Add click handler for verify button
document.getElementById('verifyButton')?.addEventListener('click', verifyProof)

// Initialize on load
initializeProve()
