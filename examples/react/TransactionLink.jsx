import React from 'react'

export const TransactionLink = ({ hash, inline = false }) => {
  if (!hash) return null

  const baseUrl = 'https://sepolia.basescan.org/tx/'

  // If inline is true, use inline styling
  const linkClassName = inline ? 'transaction-link-inline' : 'transaction-link'

  return (
    <div className={linkClassName}>
      <a href={`${baseUrl}${hash}`} target="_blank" rel="noopener noreferrer">
        View transaction
        <svg width="12" height="12" viewBox="0 0 24 24" style={{ marginLeft: '2px' }}>
          <path
            fill="currentColor"
            d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
          />
        </svg>
      </a>
    </div>
  )
}
