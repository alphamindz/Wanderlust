import React from 'react';

const EmptyState = ({
  icon: Icon,
  title = 'No items found',
  description = 'You do not have any items here yet.',
  actionButton,
  extraContent,
}) => {
  return (
    <div
      style={{
        padding: '60px 24px',
        textAlign: 'center',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border)',
        margin: '16px 0',
      }}
    >
      {Icon && (
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: '#FFF1F2',
            color: '#FF385C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Icon size={28} />
        </div>
      )}

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8, color: 'var(--dark)' }}>
        {title}
      </h3>

      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.92rem',
          maxWidth: '440px',
          margin: '0 auto 20px',
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      {actionButton && (
        <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
          {actionButton}
        </div>
      )}

      {extraContent && (
        <div style={{ marginTop: 32, textAlign: 'left' }}>
          {extraContent}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
