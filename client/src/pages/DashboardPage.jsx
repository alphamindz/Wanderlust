import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Home,
  Calendar,
  Compass,
  Heart,
  Settings,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

import OverviewTab from '../components/dashboard/OverviewTab';
import MyPropertiesTab from '../components/dashboard/MyPropertiesTab';
import HostBookingsTab from '../components/dashboard/HostBookingsTab';
import MyTripsTab from '../components/dashboard/MyTripsTab';
import WishlistTab from '../components/dashboard/WishlistTab';
import SettingsTab from '../components/dashboard/SettingsTab';

import {
  MOCK_HOST_PROPERTIES,
  MOCK_HOST_BOOKINGS,
  MOCK_USER_TRIPS,
  MOCK_WISHLIST,
} from '../data/dashboard';

const TABS = [
  { id: 'overview', label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { id: 'properties', label: 'My Properties', path: '/dashboard/properties', icon: Home, countKey: 'properties' },
  { id: 'bookings', label: 'Host Bookings', path: '/dashboard/bookings', icon: Calendar, countKey: 'pendingBookings' },
  { id: 'trips', label: 'My Trips', path: '/dashboard/trips', icon: Compass, countKey: 'upcomingTrips' },
  { id: 'wishlist', label: 'Wishlist', path: '/dashboard/wishlist', icon: Heart, countKey: 'wishlist' },
  { id: 'settings', label: 'Settings', path: '/dashboard/settings', icon: Settings },
];

const DashboardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, showToast, logout } = useAuth();

  // State for mock data manipulation
  const [properties, setProperties] = useState(MOCK_HOST_PROPERTIES);
  const [bookings, setBookings] = useState(MOCK_HOST_BOOKINGS);
  const [trips, setTrips] = useState(MOCK_USER_TRIPS);
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST);
  const [selectedDrawerBooking, setSelectedDrawerBooking] = useState(null);

  // Determine active tab from pathname
  const getCurrentTabId = () => {
    const path = location.pathname.toLowerCase().replace(/\/$/, '');
    if (path === '/dashboard/properties') return 'properties';
    if (path === '/dashboard/bookings') return 'bookings';
    if (path === '/dashboard/trips') return 'trips';
    if (path === '/dashboard/wishlist') return 'wishlist';
    if (path === '/dashboard/settings') return 'settings';
    return 'overview';
  };

  const activeTabId = getCurrentTabId();

  // Route protection
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location]);

  if (authLoading || !isAuthenticated) {
    return (
      <div
        className="container"
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div className="loading-spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Action handlers
  const handleDeleteProperty = (propertyId) => {
    setProperties((prev) => prev.filter((p) => p._id !== propertyId));
    showToast('Listing removed successfully');
  };

  const handleTogglePropertyStatus = (propertyId) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p._id === propertyId) {
          const nextStatus = p.status === 'Paused' ? 'Active' : 'Paused';
          showToast(`Listing is now ${nextStatus}`);
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const handleUpdateBookingStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b._id === bookingId) {
          return { ...b, status: newStatus };
        }
        return b;
      })
    );
    showToast(`Reservation #${bookingId} marked as ${newStatus}`);
  };

  const handleCancelTrip = (tripId) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t._id === tripId) {
          return { ...t, status: 'Cancelled' };
        }
        return t;
      })
    );
    showToast('Trip reservation cancelled. Refund initiated.');
  };

  const handleRemoveFromWishlist = (itemId) => {
    const removed = wishlist.find((w) => w._id === itemId);
    setWishlist((prev) => prev.filter((w) => w._id !== itemId));
    showToast(`"${removed?.title?.slice(0, 24)}..." removed from wishlist`);
  };

  const handleLeaveReview = (trip) => {
    showToast(`Opening review modal for "${trip.property?.title}"`);
    setTrips((prev) =>
      prev.map((t) => (t._id === trip._id ? { ...t, hasReviewed: true } : t))
    );
  };

  const handleViewBookingDetailsFromOverview = (b) => {
    setSelectedDrawerBooking(b);
    navigate('/dashboard/bookings');
  };

  // Badge counts
  const pendingBookingsCount = bookings.filter((b) => b.status === 'Pending').length;
  const upcomingTripsCount = trips.filter((t) => t.status === 'Upcoming').length;

  const counts = {
    properties: properties.length,
    pendingBookings: pendingBookingsCount > 0 ? pendingBookingsCount : undefined,
    upcomingTrips: upcomingTripsCount > 0 ? upcomingTripsCount : undefined,
    wishlist: wishlist.length > 0 ? wishlist.length : undefined,
  };

  return (
    <div className="container dashboard-container" style={{ padding: '32px 20px 96px' }}>
      {/* Dashboard Main Grid Layout (Sidebar + Content) */}
      <div className="dashboard-grid">
        {/* Left Desktop Sidebar / Mobile Tab Navigation */}
        <aside className="dashboard-sidebar">
          {/* User Brief Card in Sidebar (Desktop) */}
          <div className="dashboard-user-card desktop-only">
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
              }
              alt={user?.name || 'User'}
              className="dashboard-user-avatar"
            />
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: 'var(--dark)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name || 'Elena Rostova'}
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.email || 'host@wanderlust.com'}
              </div>
            </div>
          </div>

          {/* Navigation Links List */}
          <nav className="dashboard-nav-list" aria-label="Dashboard navigation">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTabId === tab.id;
              const count = tab.countKey ? counts[tab.countKey] : undefined;

              return (
                <Link
                  key={tab.id}
                  to={tab.path}
                  className={`dashboard-nav-item ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Icon
                      size={18}
                      color={isActive ? '#FF385C' : 'currentColor'}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    <span className="dashboard-nav-label">{tab.label}</span>
                  </div>

                  {count !== undefined && (
                    <span
                      className={`dashboard-nav-badge ${
                        tab.id === 'bookings' && pendingBookingsCount > 0 ? 'badge-alert' : ''
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Host AI Tip in Sidebar (Desktop) */}
          <div className="dashboard-ai-sidebar-widget desktop-only">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Sparkles size={16} color="#7C3AED" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#581C87' }}>
                Wanderlust Host AI
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#6B21A8', margin: '0 0 10px 0', lineHeight: 1.4 }}>
              Seasonal demand in Europe is peaking. Update your autumn rates to maximize earnings.
            </p>
            <Link
              to="/dashboard"
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#7C3AED',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                textDecoration: 'none',
              }}
            >
              <span>View Insights</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main-content">
          {activeTabId === 'overview' && (
            <OverviewTab
              user={user}
              bookings={bookings}
              properties={properties}
              onViewBookingDetails={handleViewBookingDetailsFromOverview}
            />
          )}

          {activeTabId === 'properties' && (
            <MyPropertiesTab
              properties={properties}
              onDeleteProperty={handleDeleteProperty}
              onToggleStatus={handleTogglePropertyStatus}
            />
          )}

          {activeTabId === 'bookings' && (
            <HostBookingsTab
              bookings={bookings}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              selectedDrawerBooking={selectedDrawerBooking}
              setSelectedDrawerBooking={setSelectedDrawerBooking}
            />
          )}

          {activeTabId === 'trips' && (
            <MyTripsTab
              trips={trips}
              onCancelTrip={handleCancelTrip}
              onLeaveReview={handleLeaveReview}
            />
          )}

          {activeTabId === 'wishlist' && (
            <WishlistTab
              wishlist={wishlist}
              onRemoveFromWishlist={handleRemoveFromWishlist}
            />
          )}

          {activeTabId === 'settings' && (
            <SettingsTab
              user={user}
              onSaveProfile={() => {}}
              onSavePassword={() => {}}
              onDeleteAccount={() => {
                logout();
                navigate('/');
              }}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
