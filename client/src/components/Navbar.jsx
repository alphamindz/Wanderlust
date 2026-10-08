import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LanguageSelector from './LanguageSelector';
import WLogo from './WLogo';
import {
  Search,
  Menu,
  User,
  LayoutDashboard,
  PlusCircle,
  Home,
  Calendar,
  Heart,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when route changes
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="navbar-header glass">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" id="navbar-brand-logo">
          <WLogo size={32} />
          <span>{t('nav.brand')}</span>
        </Link>

        {/* Global Search Pill Bar */}
        <form onSubmit={handleSearchSubmit} className="navbar-search-pill" id="navbar-search-form">
          <input
            type="text"
            className="navbar-search-input"
            placeholder={t('nav.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="navbar-search-input"
          />
          <button type="submit" className="navbar-search-btn" id="navbar-search-submit" aria-label="Search">
            <Search size={16} strokeWidth={2.5} />
          </button>
        </form>

        {/* Action Controls */}
        <div className="navbar-actions">
          <Link
            to={isAuthenticated ? '/listings/new' : '/login'}
            className="host-link"
            id="host-home-button"
          >
            {t('nav.hostYourHome')}
          </Link>

          {/* Multi-Language Switcher */}
          <LanguageSelector variant="navbar" />

          {/* User Profile & Menu */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              className="user-menu-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              id="user-profile-menu-toggle"
              aria-label={t('nav.userMenu')}
            >
              <Menu size={18} color="#4B5563" />
              {isAuthenticated && user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFF',
                  }}
                >
                  <User size={18} />
                </div>
              )}
            </button>

            {dropdownOpen && (
              <div className="user-dropdown-menu">
                {isAuthenticated ? (
                  <>
                    <div style={{ padding: '8px 20px 10px', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                        {user.email}
                      </div>
                    </div>
                    {/* Dashboard as first item */}
                    <Link
                      to="/dashboard"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                      style={{ fontWeight: 700, color: '#FF385C' }}
                    >
                      <LayoutDashboard size={16} />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/dashboard/properties"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Home size={16} />
                      <span>{t('nav.myProperties') || 'My Properties'}</span>
                    </Link>
                    <Link
                      to="/dashboard/trips"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Calendar size={16} />
                      <span>My Trips & Bookings</span>
                    </Link>
                    <Link
                      to="/dashboard/wishlist"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Heart size={16} />
                      <span>Saved Wishlist</span>
                    </Link>
                    <Link
                      to="/listings/new"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <PlusCircle size={16} />
                      <span>{t('nav.createNewListing')}</span>
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings size={16} />
                      <span>Account Settings</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item"
                      style={{ color: '#E11D48' }}
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                    >
                      <LogOut size={16} />
                      <span>{t('nav.logOut')}</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LogIn size={16} />
                      <span>{t('nav.logIn')}</span>
                    </Link>
                    <Link
                      to="/signup"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                      style={{ fontWeight: 600 }}
                    >
                      <UserPlus size={16} />
                      <span>{t('nav.signUp')}</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


