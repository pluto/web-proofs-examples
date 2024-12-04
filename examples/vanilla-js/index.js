import { prove } from '@plutoxyz/web-proofs'
import { DEFAULT_CONFIG } from '../config/constants'

let cleanup = null

async function initializeProve() {
  if (cleanup) cleanup()

  const config = {
    manifestUrl: document.getElementById('manifestUrl')?.value || DEFAULT_CONFIG.manifestUrl,
    containerId: 'proveContainer',
    preferredDeviceProveMode: document.getElementById('deviceMode')?.value || DEFAULT_CONFIG.preferredDeviceProveMode,
    proverMode: document.getElementById('proverMode')?.value || DEFAULT_CONFIG.defaultProverMode,
    extensionEnabled: document.getElementById('extensionEnabled')?.checked || DEFAULT_CONFIG.extensionEnabled,
    options: {
      showProofResult: document.getElementById('showProofResult')?.checked || DEFAULT_CONFIG.showProofResult,
      showError: document.getElementById('showError')?.checked || DEFAULT_CONFIG.showError,
      showLoading: document.getElementById('showLoading')?.checked || DEFAULT_CONFIG.showLoading,
      qrCodeSize: parseInt(document.getElementById('qrCodeSize')?.value || String(DEFAULT_CONFIG.defaultQrCodeSize)),
      styles: {
        button: DEFAULT_CONFIG.buttonStyles
      }
    },
    callbacks: {
      onLoadingChange: (isLoading) => {
        const container = document.getElementById('proveContainer')
        if (container) container.classList.toggle('loading', isLoading)
      },
      onError: (error) => console.error('Error:', error),
      onSuccess: (result) => console.log('Success:', result),
      onMobileAppRedirect: () => console.log('Redirecting to mobile app...')
    }
  }

  try {
    const result = await prove(config)
    if (result.proof) console.log('Final proof:', result.proof)
    else if (result.error) console.error('Final error:', result.error)
  } catch (error) {
    console.error('Initialization error:', error)
  }
}

const updateButton = document.getElementById('updateConfig')
if (updateButton) {
  updateButton.addEventListener('click', initializeProve)
}

initializeProve()
