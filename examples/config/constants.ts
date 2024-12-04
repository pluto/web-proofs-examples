export const DEFAULT_CONFIG = {
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
} as const
