import React from 'react'

export const TransactionLink = ({ hash }) => {
  if (!hash) return null

  const baseUrl = 'https://sepolia.basescan.org/tx/'
  return (
    <div className="transaction-link">
      <a href={`${baseUrl}${hash}`} target="_blank" rel="noopener noreferrer">
        View transaction on BaseScan
        <svg width="12" height="12" viewBox="0 0 24 24" style={{ marginLeft: '4px' }}>
          <path
            fill="currentColor"
            d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
          />
        </svg>
      </a>
    </div>
  )
}
