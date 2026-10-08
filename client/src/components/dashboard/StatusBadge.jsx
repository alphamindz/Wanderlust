import React from 'react';

const STATUS_STYLES = {
  active: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', dot: '#10B981' },
  confirmed: { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', dot: '#10B981' },
  completed: { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0', dot: '#22C55E' },
  pending: { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A', dot: '#F59E0B' },
  upcoming: { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE', dot: '#3B82F6' },
  paused: { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB', dot: '#9CA3AF' },
  draft: { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE', dot: '#8B5CF6' },
  cancelled: { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', dot: '#EF4444' },
  past: { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB', dot: '#9CA3AF' },
};

const StatusBadge = ({ status = 'active', size = 'md' }) => {
  const normalized = String(status).toLowerCase().trim();
  const theme = STATUS_STYLES[normalized] || STATUS_STYLES.active;

  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: isSmall ? '2px 8px' : '4px 10px',
        fontSize: isSmall ? '0.74rem' : '0.8rem',
        fontWeight: 700,
        borderRadius: '9999px',
        backgroundColor: theme.bg,
        color: theme.text,
        border: `1px solid ${theme.border}`,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: isSmall ? '5px' : '6px',
          height: isSmall ? '5px' : '6px',
          borderRadius: '50%',
          backgroundColor: theme.dot,
          flexShrink: 0,
        }}
      />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
