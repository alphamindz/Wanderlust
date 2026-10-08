import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit3,
  Trash2,
  PauseCircle,
  PlayCircle,
  Star,
  MapPin,
  Home,
  ExternalLink,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import ConfirmModal from './ConfirmModal';
import EmptyState from './EmptyState';
import { HOW_HOSTING_WORKS_STEPS } from '../../data/dashboard';
import { formatPrice, formatRating } from '../../utils/formatters';

const MyPropertiesTab = ({
  properties = [],
  onDeleteProperty,
  onToggleStatus,
  loading = false,
}) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleDeleteClick = (property) => {
    setSelectedProperty(property);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProperty) return;
    setActionLoading(true);
    if (onDeleteProperty) {
      await onDeleteProperty(selectedProperty._id);
    }
    setActionLoading(false);
    setShowDeleteModal(false);
    setSelectedProperty(null);
  };

  const renderHostingWorks = () => (
    <div
      style={{
        background: '#F9FAFB',
        borderRadius: 'var(--radius-lg)',
        padding: '32px 24px',
        border: '1px solid var(--border)',
        marginTop: 24,
      }}
    >
      <h4
        style={{
          fontSize: '1.15rem',
          fontWeight: 800,
          textAlign: 'center',
          marginBottom: 24,
          color: 'var(--dark)',
        }}
      >
        How Hosting Works on Wanderlust
      </h4>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24,
        }}
      >
        {HOW_HOSTING_WORKS_STEPS.map((step) => (
          <div
            key={step.step}
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              border: '1px solid #E5E7EB',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#FFF1F2',
                color: '#FF385C',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                fontSize: '0.9rem',
              }}
            >
              {step.step}
            </div>
            <h5 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 6px 0' }}>
              {step.title}
            </h5>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Tab Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 4px 0' }}>
            My Hosted Properties
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
            Manage listings, adjust status, update rates, and view occupancy.
          </p>
        </div>

        <Link
          to="/listings/new"
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            fontSize: '0.92rem',
            fontWeight: 700,
          }}
        >
          <Plus size={18} />
          <span>Host a New Stay</span>
        </Link>
      </div>

      {/* Property Cards Grid */}
      {properties.length === 0 ? (
        <EmptyState
          icon={Home}
          title="You haven't listed any properties yet"
          description="Turn your extra space or unique villa into extra income. Join our community of world-class hosts."
          actionButton={
            <Link to="/listings/new" className="btn btn-primary" style={{ padding: '10px 22px' }}>
              Host a New Stay
            </Link>
          }
          extraContent={renderHostingWorks()}
        />
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            {properties.map((prop) => {
              const isPaused = prop.status === 'Paused';
              return (
                <div
                  key={prop._id}
                  className="card"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {/* Property Image Cover */}
                  <div style={{ position: 'relative', height: 190, overflow: 'hidden' }}>
                    <img
                      src={prop.image?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'}
                      alt={prop.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: isPaused ? 'grayscale(0.4) opacity(0.85)' : 'none',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        display: 'flex',
                        gap: 6,
                      }}
                    >
                      <StatusBadge status={prop.status} size="sm" />
                    </div>
                  </div>

                  {/* Property Info */}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          <MapPin size={14} />
                          <span>{prop.location}, {prop.country}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontWeight: 700 }}>
                          <Star size={14} fill="#F59E0B" color="#F59E0B" />
                          <span>{formatRating(prop.rating || prop.averageRating || 4.9)}</span>
                        </div>
                      </div>

                      <h3
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          margin: '0 0 10px 0',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {prop.title}
                      </h3>

                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>
                        {formatPrice(prop.price)} <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ night</span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: 12,
                        borderTop: '1px solid #F3F4F6',
                        gap: 8,
                      }}
                    >
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link
                          to={`/listings/${prop._id}/edit`}
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          title="Edit Listing"
                          aria-label="Edit listing"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          onClick={() => onToggleStatus && onToggleStatus(prop._id)}
                          title={isPaused ? 'Activate Listing' : 'Pause Listing'}
                          aria-label={isPaused ? 'Activate listing' : 'Pause listing'}
                        >
                          {isPaused ? <PlayCircle size={14} color="#059669" /> : <PauseCircle size={14} color="#D97706" />}
                          <span>{isPaused ? 'Resume' : 'Pause'}</span>
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link
                          to={`/listings/${prop._id}`}
                          className="btn btn-secondary"
                          style={{ padding: '6px', borderRadius: '50%' }}
                          title="Preview public listing"
                          aria-label="Preview public listing"
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '6px', borderRadius: '50%', color: '#DC2626' }}
                          onClick={() => handleDeleteClick(prop)}
                          title="Delete Listing"
                          aria-label="Delete listing"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* How Hosting Works Section below grid */}
          {renderHostingWorks()}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Property Listing?"
        message={`Are you sure you want to permanently delete "${selectedProperty?.title}"? All reservation records and past metrics will be archived.`}
        confirmText="Delete Listing"
        isDanger={true}
        loading={actionLoading}
      />
    </div>
  );
};

export default MyPropertiesTab;
