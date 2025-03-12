import React from 'react'
import { TransactionLink } from './TransactionLink'

export const SuccessMessage = ({ verified, alreadyVerified, hash }) => {
  return (
    <div className="success-message">
      <div className="success-icon">
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
        </svg>
      </div>
      <div className="success-content">
        <span>{alreadyVerified ? 'Proof already verified onchain!' : 'Proof verified onchain! '}</span>
        {hash && <TransactionLink hash={hash} inline={true} />}
      </div>
    </div>
  )
}
