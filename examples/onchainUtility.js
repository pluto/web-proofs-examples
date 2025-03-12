/**
 * Utility functions for onchain operations
 */

/**
 * Validates that a value is a valid bytes32 hex string
 * @param {string} value - The value to validate
 * @param {string} name - The name of the value for logging purposes
 * @returns {boolean} - Whether the value is valid
 */
export const validateBytes32 = (value, name) => {
  if (typeof value !== 'string' || !value.startsWith('0x') || value.length !== 66) {
    console.warn(`Warning: ${name} may not be a valid bytes32 value: ${value}`)
    return false
  }
  return true
}

/**
 * Extracts a transaction hash from various possible formats
 * @param {string|object|null} hash - The hash or object containing a hash
 * @returns {string|null} - The extracted hash or null if not found
 * @throws {Error} - If the hash cannot be extracted
 */
export const extractTransactionHash = (hash) => {
  if (hash === null) {
    return null
  }

  let hashToUse
  if (typeof hash === 'object') {
    if (hash.txHash) {
      hashToUse = hash.txHash
    } else if (hash.toString) {
      hashToUse = hash.toString()
    } else {
      console.log('Could not extract transaction hash from object:', hash)
      throw new Error('Could not extract transaction hash from object')
    }
  } else {
    hashToUse = hash
  }

  if (hashToUse === null || typeof hashToUse !== 'string') {
    console.log('No valid transaction hash provided after extraction')
    return null
  }

  return hashToUse
}

/**
 * Extracts error message from simulation error
 * @param {Error} simulationError - The simulation error
 * @returns {string} - The extracted error message
 */
export const extractErrorMessage = (simulationError) => {
  let errorMessage = 'Unknown error'

  if (simulationError.message) {
    // Extract the revert reason from the error message
    const revertMatch = simulationError.message.match(/reverted with reason string '([^']+)'/)
    if (revertMatch && revertMatch[1]) {
      errorMessage = revertMatch[1]
    } else if (simulationError.message.includes('DuplicateProof')) {
      errorMessage = 'DuplicateProof'
    } else if (simulationError.message.includes('InvalidNotary')) {
      errorMessage = 'InvalidNotary'
    } else if (simulationError.message.includes('InvalidDigest')) {
      errorMessage = 'InvalidDigest'
    } else if (simulationError.message.includes('InvalidSignature')) {
      errorMessage = 'InvalidSignature'
    } else {
      // Try to extract the revert reason from the error message
      const revertMatch = simulationError.message.match(/Error: ([^()]+)\(\)/)
      if (revertMatch && revertMatch[1]) {
        errorMessage = revertMatch[1]
      } else {
        errorMessage = simulationError.message
      }
    }
  }

  return errorMessage
}

/**
 * Converts an array of bytes to a hex string
 * @param {Array<number>} arr - The array of bytes
 * @returns {string} - The hex string
 */
export const arrayToHex = (arr) => {
  return '0x' + arr.map((num) => num.toString(16).padStart(2, '0')).join('')
}

/**
 * Formats proof data for transaction submission
 * @param {Object} proofData - The proof data object
 * @returns {Object} - The formatted proof data
 */
export const formatProofData = (proofData) => {
  return {
    digest: proofData.proof.signature.digest,
    v: proofData.proof.signature.signature_v,
    r: proofData.proof.signature.signature_r,
    s: proofData.proof.signature.signature_s,
    signer: proofData.proof.signature.signer,
    // Ensure manifest is properly formatted as bytes32
    manifest:
      proofData.proof.data.manifest_hash instanceof Array
        ? arrayToHex(proofData.proof.data.manifest_hash)
        : proofData.proof.data.manifest_hash,
    // Ensure value is properly formatted as bytes32
    value: proofData.proof.signature.merkle_leaves[0]
  }
}

/**
 * Validates transaction data for proof submission
 * @param {Object} proof - The proof object
 * @returns {Object} - The validated transaction data
 * @throws {Error} - If the proof data is incomplete
 */
export const validateAndFormatTransactionData = (proof) => {
  if (
    !proof.digest ||
    !proof.r ||
    !proof.s ||
    proof.v === undefined ||
    !proof.signer ||
    !proof.manifest ||
    !proof.value
  ) {
    throw new Error('Incomplete proof data; one or more fields are missing.')
  }

  validateBytes32(proof.digest, 'digest')
  validateBytes32(proof.r, 'r')
  validateBytes32(proof.s, 's')
  validateBytes32(proof.manifest, 'manifest')
  validateBytes32(proof.value, 'value')

  return {
    digest: proof.digest,
    r: proof.r,
    s: proof.s,
    v: proof.v,
    signer: proof.signer,
    manifest: proof.manifest,
    value: proof.value
  }
}
