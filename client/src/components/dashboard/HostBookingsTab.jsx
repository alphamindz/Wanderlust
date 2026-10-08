import React, { useState } from 'react';
import {
  Search,
  Check,
  X,
  Eye,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import Drawer from './Drawer';
import EmptyState from './EmptyState';
import { formatPrice, formatDateRange, calcPricing, pluralize } from '../../utils/formatters';

const HostBookingsTab = ({
  bookings = [],
  onUpdateBookingStatus,
  selectedDrawerBooking,
  setSelectedDrawerBooking,
}) => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [localDrawerBooking, setLocalDrawerBooking] = useState(null);

  const activeDrawerBooking = selectedDrawerBooking || localDrawerBooking;

  const handleOpenDrawer = (b) => {
    if (setSelectedDrawerBooking) {
      setSelectedDrawerBooking(b);
    } else {
      setLocalDrawerBooking(b);
    }
  };

  const handleCloseDrawer = () => {
    if (setSelectedDrawerBooking) {
      setSelectedDrawerBooking(null);
    } else {
      setLocalDrawerBooking(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.status.toLowerCase() === statusFilter.toLowerCase();
    const guestName = b.guest?.name || '';
    const propTitle = b.property?.title || '';
    const bookingCode = b.bookingCode || '';
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      guestName.toLowerCase().includes(q) ||
      propTitle.toLowerCase().includes(q) ||
      bookingCode.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleAccept = (bookingId) => {
    if (onUpdateBookingStatus) {
      onUpdateBookingStatus(bookingId, 'Confirmed');
    }
    if (activeDrawerBooking && activeDrawerBooking._id === bookingId) {
      handleCloseDrawer();
    }
  };

  const handleDecline = (bookingId) => {
    if (onUpdateBookingStatus) {
      onUpdateBookingStatus(bookingId, 'Cancelled');
    }
    if (activeDrawerBooking && activeDrawerBooking._id === bookingId) {
      handleCloseDrawer();
    }
  };

  // Render price calculation for drawer
  const pricing = activeDrawerBooking
    ? calcPricing(
        activeDrawerBooking.property?.price || Math.round(activeDrawerBooking.totalPrice / (activeDrawerBooking.nights || 1)),
        activeDrawerBooking.nights || 1
      )
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Tab Top Bar */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 4px 0' }}>
          Host Reservations & Bookings
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
          Review inbound reservation requests, manage confirmed guest stays, and view invoices.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          background: '#FFFFFF',
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: statusFilter === status ? 700 : 500,
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: statusFilter === status ? '#FF385C' : '#E5E7EB',
                backgroundColor: statusFilter === status ? '#FFF1F2' : '#FFFFFF',
                color: statusFilter === status ? '#FF385C' : '#4B5563',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Search guest, stay or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '36px',
              paddingTop: '8px',
              paddingBottom: '8px',
              fontSize: '0.85rem',
              borderRadius: '9999px',
            }}
          />
        </div>
      </div>

      {/* Bookings Table Container */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        {filteredBookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No reservations found"
            description="There are no bookings matching your current filter criteria."
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 20px', fontSize: '0.78rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
                    Guest
                  </th>
                  <th style={{ padding: '14px 16px', fontSize: '0.78rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
                    Property
                  </th>
                  <th style={{ padding: '14px 16px', fontSize: '0.78rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
                    Dates
                  </th>
                  <th style={{ padding: '14px 16px', fontSize: '0.78rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
                    Status
                  </th>
                  <th style={{ padding: '14px 16px', fontSize: '0.78rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
                    Payout
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '0.78rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr
                    key={b._id}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                      transition: 'background 0.15s ease',
                    }}
                    className="hover:bg-slate-50"
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={b.guest?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                          alt={b.guest?.name}
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)' }}>
                            {b.guest?.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {b.bookingCode || 'WL-REQUEST'} · {pluralize(b.guests || 2, 'guest')}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px 16px', fontSize: '0.88rem' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {b.property?.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {b.property?.location}
                      </div>
                    </td>

                    <td style={{ padding: '16px 16px', fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                      <div>{formatDateRange(b.startDate, b.endDate)}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {pluralize(b.nights || 1, 'night')}
                      </div>
                    </td>

                    <td style={{ padding: '16px 16px' }}>
                      <StatusBadge status={b.status} />
                    </td>

                    <td style={{ padding: '16px 16px', fontWeight: 800, fontSize: '0.92rem', color: 'var(--dark)' }}>
                      {formatPrice(b.totalPrice)}
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                        {b.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ padding: '6px 12px', fontSize: '0.78rem', backgroundColor: '#059669', borderColor: '#059669' }}
                              onClick={() => handleAccept(b._id)}
                              title="Accept reservation"
                              aria-label="Accept reservation"
                            >
                              <Check size={14} />
                              <span>Accept</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '0.78rem', color: '#DC2626' }}
                              onClick={() => handleDecline(b._id)}
                              title="Decline reservation"
                              aria-label="Decline reservation"
                            >
                              <X size={14} />
                              <span>Decline</span>
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                          onClick={() => handleOpenDrawer(b)}
                          title="View Details"
                          aria-label="View reservation details"
                        >
                          <Eye size={14} />
                          <span>Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Side Drawer: Detailed Reservation View */}
      <Drawer
        isOpen={Boolean(activeDrawerBooking)}
        onClose={handleCloseDrawer}
        title={`Reservation #${activeDrawerBooking?.bookingCode || 'WL-RES'}`}
        footer={
          activeDrawerBooking?.status === 'Pending' ? (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ color: '#DC2626' }}
                onClick={() => handleDecline(activeDrawerBooking._id)}
              >
                Decline Request
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ backgroundColor: '#059669', borderColor: '#059669' }}
                onClick={() => handleAccept(activeDrawerBooking._id)}
              >
                Accept Reservation
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <StatusBadge status={activeDrawerBooking?.status} />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseDrawer}
              >
                Close
              </button>
            </div>
          )
        }
      >
        {activeDrawerBooking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Guest Profile Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px',
                background: '#F9FAFB',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #E5E7EB',
              }}
            >
              <img
                src={activeDrawerBooking.guest?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                alt={activeDrawerBooking.guest?.name}
                style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                    {activeDrawerBooking.guest?.name}
                  </h4>
                  <ShieldCheck size={16} color="#059669" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Mail size={13} /> {activeDrawerBooking.guest?.email}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Phone size={13} /> {activeDrawerBooking.guest?.phone || '+1 (555) 019-2834'}
                  </span>
                </div>
              </div>
            </div>

            {/* Property Overview */}
            <div
              style={{
                display: 'flex',
                gap: 14,
                padding: '16px',
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
              }}
            >
              {activeDrawerBooking.property?.image && (
                <img
                  src={activeDrawerBooking.property.image}
                  alt={activeDrawerBooking.property.title}
                  style={{ width: 80, height: 60, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                />
              )}
              <div>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px 0' }}>
                  {activeDrawerBooking.property?.title}
                </h5>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  📍 {activeDrawerBooking.property?.location}
                </p>
              </div>
            </div>

            {/* Stay Details */}
            <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
              <h5 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', margin: '0 0 12px 0' }}>
                Trip Timeline
              </h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Check-in</div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                    {new Date(activeDrawerBooking.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>After 3:00 PM</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Checkout</div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                    {new Date(activeDrawerBooking.endDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Before 11:00 AM</div>
                </div>
              </div>
            </div>

            {/* Guest Message */}
            {activeDrawerBooking.message && (
              <div style={{ background: '#FFFBEB', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid #FDE68A' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#92400E', fontWeight: 700, fontSize: '0.82rem', marginBottom: 4 }}>
                  <MessageSquare size={14} /> Message from Guest
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#78350F', lineHeight: 1.5 }}>
                  "{activeDrawerBooking.message}"
                </p>
              </div>
            )}

            {/* Pricing Breakdown (calcPricing) */}
            {pricing && (
              <div>
                <h5 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', margin: '0 0 12px 0' }}>
                  Financial Breakdown
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>{formatPrice(activeDrawerBooking.property?.price || Math.round(activeDrawerBooking.totalPrice / pricing.nights))} × {pluralize(pricing.nights, 'night')}</span>
                    <span>{formatPrice(pricing.basePrice)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Cleaning fee</span>
                    <span>{formatPrice(pricing.cleaningFee)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                    <span>Marketplace host service fee</span>
                    <span>-{formatPrice(pricing.serviceFee)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', color: 'var(--dark)', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                    <span>Net Host Payout</span>
                    <span style={{ color: '#059669' }}>{formatPrice(pricing.basePrice + pricing.cleaningFee - pricing.serviceFee)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default HostBookingsTab;
