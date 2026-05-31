import type { ReactNode } from 'react'

type TicketModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
}

export default function TicketModal({
  open,
  onClose,
  title,
  children,
  footer,
}: TicketModalProps) {
  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        padding: 24,
      }}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          background: '#ffffff',
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(15,23,42,0.18)',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>
              {title ?? 'Modal Title'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: 20,
              cursor: 'pointer',
              color: '#6b7280',
            }}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div style={{ padding: '20px 24px', color: '#374151', lineHeight: 1.6 }}>
          {children}
        </div>

        {footer && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              background: '#f9fafb',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}