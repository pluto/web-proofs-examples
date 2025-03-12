import React from 'react'

export const SuccessMessage = ({ verified, alreadyVerified }) => {
  return (
    <div className="success-message">
      <div className="success-icon">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
      </div>
      <span>{alreadyVerified ? 'Proof already verified onchain!' : 'Proof verified onchain!'}</span>
    </div>
  )
}
