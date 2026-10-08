import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Calendar,
  MapPin,
  Star,
  ExternalLink,
  Ban,
  CheckCircle,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import ConfirmModal from './ConfirmModal';
import EmptyState from './EmptyState';
import { formatPrice, formatDateRange, pluralize } from '../../utils/formatters';

const MyTripsTab = ({
  trips = [],
  onCancelTrip,
  onLeaveReview,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('Upcoming'); // Upcoming | Past | Cancelled
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const filteredTrips = trips.filter((t) => {
    if (activeSubTab === 'Upcoming') return t.status === 'Upcoming';
    if (activeSubTab === 'Past') return t.status === 'Past';
    if (activeSubTab === 'Cancelled') return t.status === 'Cancelled';
    return true;
  });

  const handleCancelClick = (trip) => {
    setSelectedTrip(trip);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedTrip) return;
    setCancelLoading(true);
    if (onCancelTrip) {
      await onCancelTrip(selectedTrip._id);
    }
    setCancelLoading(false);
    setShowCancelModal(false);
    setSelectedTrip(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Tab Top Bar */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 4px 0' }}>
          My Trips & Travel Plans
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
          Manage your upcoming stays, review past travel experiences, and track receipts.
        </p>
      </div>

      {/* Sub-tabs Filter */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          borderBottom: '1px solid var(--border)',
          paddingBottom: 4,
        }}
      >
        {['Upcoming', 'Past', 'Cancelled'].map((tab) => {
          const count = trips.filter((t) => t.status === tab).length;
          const isActive = activeSubTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveSubTab(tab)}
              style={{
                padding: '10px 18px',
                fontSize: '0.92rem',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#FF385C' : 'var(--text-muted)',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid #FF385C' : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab} Trips</span>
              <span
                style={{
                  fontSize: '0.74rem',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  backgroundColor: isActive ? '#FFF1F2' : '#F3F4F6',
                  color: isActive ? '#FF385C' : '#6B7280',
                  fontWeight: 700,
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Trips Content Grid */}
      {filteredTrips.length === 0 ? (
        <EmptyState
          icon={Compass}
          title={`No ${activeSubTab.toLowerCase()} trips found`}
          description={
            activeSubTab === 'Upcoming'
              ? 'Time to dust off your passport and discover breathtaking villas, cabins, and lofts worldwide.'
              : `You do not have any ${activeSubTab.toLowerCase()} trips in your itinerary history.`
          }
          actionButton={
            activeSubTab === 'Upcoming' ? (
              <Link to="/" className="btn btn-primary" style={{ padding: '10px 22px' }}>
                Explore Global Stays
              </Link>
            ) : null
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {filteredTrips.map((trip) => (
            <div
              key={trip._id}
              className="card"
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                <img
                  src={trip.property?.image}
                  alt={trip.property?.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <StatusBadge status={trip.status} size="sm" />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#FFF',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  {trip.bookingCode || 'WL-CONFIRMED'}
                </div>
              </div>

              <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: 4 }}>
                    <MapPin size={14} />
                    <span>{trip.property?.location}, {trip.property?.country}</span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 10px 0', lineHeight: 1.4 }}>
                    {trip.property?.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: 6 }}>
                    <Calendar size={15} color="#FF385C" />
                    <span style={{ fontWeight: 600 }}>{formatDateRange(trip.startDate, trip.endDate)}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                    {pluralize(trip.nights || 1, 'night')} · {pluralize(trip.guests || 1, 'guest')} · Hosted by {trip.hostName || 'Superhost'}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 12,
                    borderTop: '1px solid #F3F4F6',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Paid</div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--dark)' }}>
                      {formatPrice(trip.totalPrice)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {trip.status === 'Upcoming' && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#DC2626' }}
                        onClick={() => handleCancelClick(trip)}
                      >
                        <Ban size={14} />
                        <span>Cancel</span>
                      </button>
                    )}

                    {trip.status === 'Past' && (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', color: trip.hasReviewed ? '#059669' : '#FF385C' }}
                        onClick={() => onLeaveReview && onLeaveReview(trip)}
                        disabled={trip.hasReviewed}
                      >
                        {trip.hasReviewed ? (
                          <>
                            <CheckCircle size={14} color="#059669" />
                            <span>Reviewed</span>
                          </>
                        ) : (
                          <>
                            <Star size={14} />
                            <span>Review Stay</span>
                          </>
                        )}
                      </button>
                    )}

                    <Link
                      to="/"
                      className="btn btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                      title="View Stay Details"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Reservation Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Trip Reservation?"
        message={`Are you sure you want to cancel your upcoming stay at "${selectedTrip?.property?.title}"? Depending on the host's policy, you will receive a full refund within 3-5 business days.`}
        confirmText="Yes, Cancel Booking"
        isDanger={true}
        loading={cancelLoading}
      />
    </div>
  );
};

export default MyTripsTab;
