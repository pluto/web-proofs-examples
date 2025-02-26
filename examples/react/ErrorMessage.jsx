import React from 'react'

export const ErrorMessage = ({ error }) => {
  // Extract just the main error message before any details/metadata
  const simplifyError = (errorMsg) => {
    const mainMessage = errorMsg.split('Details:')[0].trim()
    return mainMessage.length > 150 ? mainMessage.slice(0, 150) + '...' : mainMessage
  }

  return <div className="error-message">{simplifyError(error)}</div>
}
