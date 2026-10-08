import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Heart } from 'lucide-react';
import WLogo from './WLogo';
import { formatPrice, formatRating } from '../utils/formatters';

const ListingCard = ({ listing }) => {
  const { t } = useTranslation();
  const [favorited, setFavorited] = useState(false);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited(!favorited);
  };

  // Image source handling (Cloudinary, local uploads, or Unsplash fallback)
  const imageUrl =
    listing.image?.url ||
    (Array.isArray(listing.images) && listing.images[0]) ||
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

  const categoryLabel = listing.category ? t(`categories.${listing.category}`, listing.category) : t('home.featured');
  const reviewCount = listing.reviewCount || (Array.isArray(listing.reviews) ? listing.reviews.length : 12);
  const ratingVal = formatRating(listing.averageRating, 4.9);

  return (
    <Link
      to={`/listings/${listing._id}`}
      className="listing-card"
      id={`listing-card-${listing._id}`}
    >
      <div className="listing-card-media">
        <img
          src={imageUrl}
          alt={listing.title}
          className="listing-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Combined Badges Container (top-3 left-3, flex-col, items-start, gap-1.5) - Prevents Overlapping */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 6,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(8px)',
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-sm)',
              color: 'var(--dark)',
              letterSpacing: '0.02em',
              display: 'inline-block',
            }}
          >
            {categoryLabel}
          </span>
          <span
            style={{
              background: 'rgba(124, 58, 237, 0.92)',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              backdropFilter: 'blur(6px)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              boxShadow: '0 2px 6px rgba(124, 58, 237, 0.3)',
            }}
          >
            <WLogo size={13} /> {t('home.aiInsights')}
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          className={`favorite-btn ${favorited ? 'favorited' : ''}`}
          onClick={toggleFavorite}
          aria-label={t('home.saveToFavorites')}
        >
          <Heart size={18} fill={favorited ? '#FF385C' : 'none'} color={favorited ? '#FF385C' : '#FFFFFF'} />
        </button>
      </div>

      <div className="listing-info">
        <div className="listing-header-row">
          <div className="listing-title" title={listing.title}>{listing.title}</div>
          <div className="listing-rating" aria-label={`Rating ${ratingVal} with ${reviewCount} reviews`}>
            <Star size={14} fill="#F59E0B" color="#F59E0B" />
            <span>
              {ratingVal}
              <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.82rem', marginLeft: 3 }}>
                ({reviewCount})
              </span>
            </span>
          </div>
        </div>

        <div className="listing-location">
          {listing.location}, {listing.country}
        </div>

        <div className="listing-price-row">
          <span className="listing-price-amount">{formatPrice(listing.price)}</span>{' '}
          <span className="listing-price-period" style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.9rem' }}>
            / {t('home.night')}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
