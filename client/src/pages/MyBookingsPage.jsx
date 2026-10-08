import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, XCircle, Loader2, Compass } from 'lucide-react';

const MyBookingsPage = () => {
  const { isAuthenticated, showToast } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      await api.delete(`/bookings/${bookingId}`);
      showToast('Reservation cancelled successfully');
      setBookings(bookings.filter((b) => b._id !== bookingId));
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel reservation', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
        <Loader2 size={36} color="#FF385C" className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0 80px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 4 }}>My Trips & Reservations</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Review upcoming stays, confirmed itineraries, and trip receipts.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '60px 20px',
            textAlign: 'center',
            maxWidth: 520,
            margin: '0 auto',
          }}
        >
          <Compass size={40} color="#FF385C" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ marginBottom: 8 }}>No trips booked... yet!</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
            Time to dust off your bags and start planning your next getaway.
          </p>
          <Link to="/" className="btn btn-primary">
            Start Exploring Stays
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {bookings.map((booking) => {
            const listing = booking.listing || {};
            return (
              <div
                key={booking._id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 24,
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <img
                    src={
                      listing.image?.url ||
                      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={listing.title}
                    style={{
                      width: 140,
                      height: 100,
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                    }}
                  />

                  <div>
                    <span
                      style={{
                        background: '#ECFDF5',
                        color: '#065F46',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Confirmed Stay
                    </span>
                    <h3 style={{ fontSize: '1.2rem', margin: '6px 0 4px' }}>
                      <Link to={`/listings/${listing._id}`} style={{ color: 'var(--dark)' }}>
                        {listing.title || 'Reserved Property'}
                      </Link>
                    </h3>
                    <p
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <MapPin size={15} />
                      <span>
                        {listing.location}, {listing.country}
                      </span>
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        gap: 16,
                        marginTop: 10,
                        fontSize: '0.85rem',
                        color: 'var(--dark)',
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={15} color="#6B7280" />
                        {new Date(booking.checkIn).toLocaleDateString()} —{' '}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                      <span>·</span>
                      <span>
                        {booking.totalNights} night{booking.totalNights === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 12,
                  }}
                >
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Total amount paid
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--dark)' }}>
                      ${booking.totalPrice}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <Link to={`/listings/${listing._id}`} className="btn btn-secondary">
                      View Stay
                    </Link>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleCancelBooking(booking._id)}
                    >
                      <XCircle size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
