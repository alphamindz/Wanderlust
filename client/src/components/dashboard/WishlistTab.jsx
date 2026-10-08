import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin } from 'lucide-react';
import EmptyState from './EmptyState';
import { formatPrice, formatRating } from '../../utils/formatters';

const WishlistTab = ({
  wishlist = [],
  onRemoveFromWishlist,
}) => {
  const handleHeartClick = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    setRemovedItem(item);
    if (onRemoveFromWishlist) {
      onRemoveFromWishlist(item._id);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header */}
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
            Saved Wishlist & Favorites
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
            {wishlist.length} extraordinary properties saved for future travel inspirations.
          </p>
        </div>

        <Link to="/" className="btn btn-secondary" style={{ fontSize: '0.88rem' }}>
          <span>Explore More Stays</span>
        </Link>
      </div>

      {/* Grid of Wishlist Items */}
      {wishlist.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="As you search Wanderlust, tap the heart icon on any property to save your favorite sanctuaries and villas here."
          actionButton={
            <Link to="/" className="btn btn-primary" style={{ padding: '10px 22px' }}>
              Discover Stays
            </Link>
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
          }}
        >
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="card listing-card"
              style={{
                background: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {/* Photo & Heart Action */}
              <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                <img
                  src={item.image?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Filled Heart Button */}
                <button
                  type="button"
                  onClick={(e) => handleHeartClick(item, e)}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(4px)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    transition: 'transform 0.15s ease',
                  }}
                  title="Remove from Wishlist"
                  aria-label="Remove from Wishlist"
                >
                  <Heart size={18} fill="#FF385C" color="#FF385C" />
                </button>

                {item.category && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 9px',
                      borderRadius: '9999px',
                    }}
                  >
                    {item.category}
                  </div>
                )}
              </div>

              {/* Card Meta Content */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      <MapPin size={14} />
                      <span>{item.location}, {item.country}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.85rem', fontWeight: 700 }}>
                      <Star size={14} fill="#F59E0B" color="#F59E0B" />
                      <span>{formatRating(item.averageRating || item.rating || 4.9)}</span>
                    </div>
                  </div>

                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      margin: '0 0 12px 0',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.title}
                  </h3>
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
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {formatPrice(item.price)} <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ night</span>
                  </div>

                  <Link
                    to="/"
                    className="btn btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                  >
                    <span>Reserve</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
