import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  isPositive = true,
  iconColor = '#FF385C',
  iconBg = '#FFF1F2',
  loading = false,
}) => {
  if (loading) {
    return (
      <div
        className="card animate-pulse"
        style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--card-bg, #FFFFFF)',
          border: '1px solid var(--border)',
          minHeight: '136px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ width: '80px', height: '14px', background: '#E5E7EB', borderRadius: 4 }} />
          <div style={{ width: '36px', height: '36px', background: '#F3F4F6', borderRadius: 10 }} />
        </div>
        <div style={{ width: '120px', height: '28px', background: '#E5E7EB', borderRadius: 6, marginBottom: 8 }} />
        <div style={{ width: '90px', height: '12px', background: '#F3F4F6', borderRadius: 4 }} />
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{
        padding: '22px 24px',
        borderRadius: 'var(--radius-lg)',
        background: '#FFFFFF',
        border: '1px solid var(--border)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              backgroundColor: iconBg,
              color: iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div>
        <div
          style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          {value}
        </div>

        {trend && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.78rem',
              fontWeight: 600,
              color: isPositive ? '#059669' : '#DC2626',
            }}
          >
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
