import { prove } from '@plutoxyz/web-proofs'

// Default configuration values
const PROVE_CONFIG = {
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
}

// Helper function to get the value of an input element or fallback to a default value
const getValueOrDefault = (id, fallback, parser = (val) => val) => {
  const element = document.getElementById(id)
  if (!element) return fallback
  if (element.type === 'checkbox') return element.checked || fallback
  return parser(element.value || fallback)
}

const getProveConfig = () => ({
  manifestUrl: getValueOrDefault('manifestUrl', PROVE_CONFIG.manifestUrl),
  containerId: 'proveContainer',
  preferredDeviceProveMode: getValueOrDefault('deviceMode', PROVE_CONFIG.preferredDeviceProveMode),
  proverMode: getValueOrDefault('proverMode', PROVE_CONFIG.defaultProverMode),
  extensionEnabled: getValueOrDefault('extensionEnabled', PROVE_CONFIG.extensionEnabled),
  options: {
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
    onSuccess: (result) => console.log('Success:', result),
    onMobileAppRedirect: () => console.log('Redirecting to mobile app...')
  }
})

// Function to initialize the prove process
async function initializeProve() {
  try {
    const config = getProveConfig()
    // Initialize the prove process
    const result = await prove(config)
    if (result.proof) console.log('Final proof:', result.proof)
    else if (result.error) console.error('Final error:', result.error)
  } catch (error) {
    console.error('Initialization error:', error)
  }
}

// Add an event listener to the update button
document.getElementById('updateConfig')?.addEventListener('click', initializeProve)

initializeProve()
