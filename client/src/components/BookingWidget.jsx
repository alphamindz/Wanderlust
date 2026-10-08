import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Star, ShieldCheck, CalendarCheck, Info, Loader2 } from 'lucide-react';
import { formatPrice, pluralize, calcPricing, getReviewStats } from '../utils/formatters';

const BookingWidget = ({ listing }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated, showToast } = useAuth();
  const navigate = useNavigate();

  const formatDateForInput = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Initialize dates: check-in 2 days from today, checkout 6 days from today (4 nights)
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => formatDateForInput(today), [today]);

  const defaultCheckIn = new Date(today);
  defaultCheckIn.setDate(today.getDate() + 2);
  const defaultCheckOut = new Date(today);
  defaultCheckOut.setDate(today.getDate() + 6);

  const [checkIn, setCheckIn] = useState(formatDateForInput(defaultCheckIn));
  const [checkOut, setCheckOut] = useState(formatDateForInput(defaultCheckOut));
  const [guestsCount, setGuestsCount] = useState(1);
  const [reserving, setReserving] = useState(false);

  // Compute minimum valid check-out date (Check-in + 1 day)
  const minCheckOutStr = useMemo(() => {
    if (!checkIn) return todayStr;
    const [y, m, d] = checkIn.split('-').map(Number);
    const nextDay = new Date(y, m - 1, d + 1);
    return formatDateForInput(nextDay);
  }, [checkIn, todayStr]);

  // Handle check-in change with auto-adjustment of checkout
  const handleCheckInChange = (newCheckIn) => {
    setCheckIn(newCheckIn);
    if (!newCheckIn) return;
    const [y, m, d] = newCheckIn.split('-').map(Number);
    const nextDayStr = formatDateForInput(new Date(y, m - 1, d + 1));
    if (!checkOut || checkOut <= newCheckIn) {
      setCheckOut(nextDayStr);
    }
  };

  // Calculate nights
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const [y1, m1, d1] = checkIn.split('-').map(Number);
    const [y2, m2, d2] = checkOut.split('-').map(Number);
    const start = new Date(y1, m1 - 1, d1);
    const end = new Date(y2, m2 - 1, d2);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  }, [checkIn, checkOut]);

  // Pricing calculation via pure helper
  const { basePrice, cleaningFee, serviceFee, totalPrice } = useMemo(
    () => calcPricing(listing.price, nights),
    [listing.price, nights]
  );

  const currentUserId = user?._id || user?.id;
  const ownerId = listing?.owner?._id || listing?.owner?.id || listing?.owner;
  const isOwner = Boolean(
    isAuthenticated &&
      user &&
      currentUserId &&
      ownerId &&
      String(currentUserId) === String(ownerId)
  );

  const maxGuests = Math.max(1, Number(listing?.guests) || 4);
  const { formattedRating, reviewCount } = getReviewStats(listing, listing?.reviews);

  const handleReservation = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast(t('booking.loginToReserve'), 'error');
      navigate('/login');
      return;
    }

    if (isOwner) {
      showToast(t('booking.cannotBookOwn'), 'error');
      return;
    }

    if (checkOut <= checkIn) {
      showToast(t('booking.datesError'), 'error');
      return;
    }

    setReserving(true);
    try {
      const response = await api.post('/bookings', {
        listingId: listing._id,
        checkIn,
        checkOut,
        totalNights: nights,
        guestsCount: Number(guestsCount),
      });

      showToast(`Reservation confirmed! Reference #${response.data.booking._id.slice(-6).toUpperCase()}`);
      navigate('/my-bookings');
    } catch (err) {
      console.error('Reservation error:', err);
      showToast(err.response?.data?.message || 'Failed to complete reservation', 'error');
    } finally {
      setReserving(false);
    }
  };

  return (
    <div
      className="booking-widget booking-widget-card"
      id="booking-reservation-widget"
      style={{
        position: 'sticky',
        top: '96px',
        background: '#FFFFFF',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <div className="booking-widget-header" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span className="booking-widget-price" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>
            {formatPrice(listing.price)}
          </span>{' '}
          <span className="booking-widget-period" style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
            / {t('booking.night')}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
          <Star size={16} fill="#F59E0B" color="#F59E0B" />
          <span>{formattedRating}</span>
          <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem' }}>
            · {pluralize(reviewCount, 'review')}
          </span>
        </div>
      </div>

      <form onSubmit={handleReservation}>
        <div className="booking-dates-box" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '18px' }}>
          <div className="booking-dates-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--border)' }}>
            <div className="booking-date-field" style={{ padding: '10px 14px', borderRight: '1px solid var(--border)' }}>
              <label className="booking-date-label" htmlFor="booking-checkin" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
                {t('booking.checkIn')}
              </label>
              <input
                id="booking-checkin"
                type="date"
                className="booking-date-input"
                value={checkIn}
                min={todayStr}
                onChange={(e) => handleCheckInChange(e.target.value)}
                required
                style={{ width: '100%', border: 'none', fontSize: '0.9rem', color: 'var(--dark)', fontWeight: 600, background: 'transparent' }}
              />
            </div>
            <div className="booking-date-field" style={{ padding: '10px 14px' }}>
              <label className="booking-date-label" htmlFor="booking-checkout" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
                {t('booking.checkOut')}
              </label>
              <input
                id="booking-checkout"
                type="date"
                className="booking-date-input"
                value={checkOut}
                min={minCheckOutStr}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                style={{ width: '100%', border: 'none', fontSize: '0.9rem', color: 'var(--dark)', fontWeight: 600, background: 'transparent' }}
              />
            </div>
          </div>

          <div style={{ padding: '10px 14px' }}>
            <label className="booking-date-label" htmlFor="booking-guests-select" style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
              {t('booking.guests')}
            </label>
            <select
              id="booking-guests-select"
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                fontSize: '0.92rem',
                fontWeight: 600,
                color: 'var(--dark)',
                cursor: 'pointer',
              }}
              value={guestsCount}
              onChange={(e) => setGuestsCount(Number(e.target.value))}
            >
              {[...Array(maxGuests)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {pluralize(i + 1, 'guest')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: 700 }}
          disabled={reserving}
          id="reserve-property-button"
        >
          {reserving ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>{t('booking.reserving')}</span>
            </>
          ) : (
            <>
              <CalendarCheck size={20} />
              <span>{t('booking.reserve')}</span>
            </>
          )}
        </button>

        <p
          style={{
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginTop: 10,
            marginBottom: 0,
          }}
        >
          {t('booking.instantNotice') || "You won't be charged yet"}
        </p>

        {/* Live Price Breakdown */}
        <div style={{ marginTop: 20 }}>
          <div className="price-breakdown-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            <span>
              {formatPrice(listing.price)} × {pluralize(nights, 'night')}
            </span>
            <span style={{ fontWeight: 600, color: 'var(--dark)' }}>{formatPrice(basePrice)}</span>
          </div>

          <div className="price-breakdown-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>{t('booking.cleaningFee')}</span>
              <span title="One-time cleaning and sanitation fee" style={{ cursor: 'help', display: 'inline-flex' }}>
                <Info size={14} color="#9CA3AF" />
              </span>
            </span>
            <span style={{ fontWeight: 600, color: 'var(--dark)' }}>{formatPrice(cleaningFee)}</span>
          </div>

          <div className="price-breakdown-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>{t('booking.serviceFee')}</span>
              <span title="Marketplace 12% service fee for 24/7 guest support and traveler protection" style={{ cursor: 'help', display: 'inline-flex' }}>
                <Info size={14} color="#9CA3AF" />
              </span>
            </span>
            <span style={{ fontWeight: 600, color: 'var(--dark)' }}>{formatPrice(serviceFee)}</span>
          </div>

          <div className="price-breakdown-total" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '16px', marginTop: '16px', borderTop: '1px solid var(--border)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--dark)' }}>
            <span>{t('booking.totalBeforeTaxes')}</span>
            <span style={{ color: 'var(--primary)' }}>{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </form>

      {/* Buyer Protection Guarantee - High Contrast & Clear Typography */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 20,
          padding: '14px 16px',
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.88rem',
          fontWeight: 600,
          color: '#065F46',
        }}
      >
        <ShieldCheck size={22} color="#059669" style={{ flexShrink: 0 }} />
        <span style={{ lineHeight: 1.4 }}>
          <strong>Buyer Protection Guarantee:</strong> Every booking is backed by Wanderlust Peace of Mind™ cover.
        </span>
      </div>
    </div>
  );
};

export default BookingWidget;
