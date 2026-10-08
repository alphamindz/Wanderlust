import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import PropertyMap from '../components/PropertyMap';
import ReviewSection from '../components/ReviewSection';
import BookingWidget from '../components/BookingWidget';
import ListingCard from '../components/ListingCard';
import AIBudgetEstimator from '../components/AIBudgetEstimator';
import AISmartItinerary from '../components/AISmartItinerary';
import {
  Bot,
  Star,
  MapPin,
  Share2,
  Edit3,
  Trash2,
  Wifi,
  Car,
  Utensils,
  Wind,
  Waves,
  ShieldCheck,
  CheckCircle,
  Loader2,
  Calculator,
  Compass,
  Calendar,
  Grid,
  X,
  ChevronLeft,
  ChevronRight,
  Award,
  Clock,
  Ban,
  HeartHandshake,
  AlertTriangle,
} from 'lucide-react';
import { pluralize, getReviewStats } from '../utils/formatters';

const amenityIcons = {
  'Fast WiFi': Wifi,
  'WiFi': Wifi,
  'Fast WiFi (250 Mbps)': Wifi,
  'Kitchen': Utensils,
  'Chef Kitchen': Utensils,
  'Free parking': Car,
  'Air conditioning': Wind,
  'Infinity Pool': Waves,
  'Pool': Waves,
};

// Curated 5-photo fallback collections for each category
const categoryGalleries = {
  Beachfront: [
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
  ],
  Cabins: [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80',
  ],
  'Iconic Cities': [
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  ],
  Castles: [
    'https://images.unsplash.com/photo-1524397076568-5a7e65dbcb4c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585543805890-6051f7829f98?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1533158307587-828f0a76ef46?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
  ],
  Lakefront: [
    'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  ],
  Arctic: [
    'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1548777123-e216912df7d8?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516466723877-a4bc14b60f87?auto=format&fit=crop&w=800&q=80',
  ],
  Camping: [
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
  ],
  Mansions: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
  ],
};

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, showToast } = useAuth();

  const [listing, setListing] = useState(null);
  const [similarListings, setSimilarListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'budget' | 'itinerary'

  // Lightbox Gallery Modal
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const fetchListing = useCallback(async () => {
    try {
      const response = await api.get(`/listings/${id}`);
      setListing(response.data.listing);

      // Fetch similar listings based on category
      const allRes = await api.get('/listings');
      const allListings = allRes.data.listings || [];
      const currentCategory = response.data.listing?.category;
      const filtered = allListings
        .filter((item) => item._id !== id)
        .sort((a, _b) => (a.category === currentCategory ? -1 : 1))
        .slice(0, 4);
      setSimilarListings(filtered);
    } catch (err) {
      console.error('Error fetching listing:', err);
      showToast('Could not load property details', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchListing();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchListing]);

  // Gallery Photos helper (1 large + 4 small)
  const galleryPhotos = useMemo(() => {
    if (!listing) return [];
    if (Array.isArray(listing.gallery) && listing.gallery.length >= 5) {
      return listing.gallery;
    }
    const main =
      listing.image?.url ||
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80';
    const catImages = categoryGalleries[listing.category] || categoryGalleries.Beachfront;
    return [main, ...catImages.slice(1, 5)];
  }, [listing]);

  const nextLightboxPhoto = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % galleryPhotos.length);
  }, [galleryPhotos.length]);

  const prevLightboxPhoto = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  }, [galleryPhotos.length]);

  // Close modals on Escape key & arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) setLightboxOpen(false);
        if (showDeleteModal) setShowDeleteModal(false);
      }
      if (lightboxOpen) {
        if (e.key === 'ArrowRight') nextLightboxPhoto();
        if (e.key === 'ArrowLeft') prevLightboxPhoto();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, showDeleteModal, nextLightboxPhoto, prevLightboxPhoto]);

  const handleDeleteListing = async () => {
    setDeleting(true);
    try {
      await api.delete(`/listings/${id}`);
      showToast('Listing successfully deleted');
      setShowDeleteModal(false);
      navigate('/');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete listing', 'error');
      setDeleting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title || 'Wanderlust Stay',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast(t('detail.linkCopied') || 'Link copied to clipboard!');
    }
  };

  const openLightbox = (index = 0) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Loader2 size={40} color="#FF385C" className="animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: 12 }}>Listing Not Found</h2>
        <p style={{ color: 'var(--text-muted)', margin: '0 auto 24px', maxWidth: 480 }}>
          The property you are looking for may have been removed or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary">
          Return to Explore
        </Link>
      </div>
    );
  }

  const currentUserId = user?._id || user?.id;
  const ownerId = listing?.owner?._id || listing?.owner?.id || listing?.owner;
  const isOwner = Boolean(
    isAuthenticated &&
      user &&
      currentUserId &&
      ownerId &&
      (String(currentUserId) === String(ownerId) || user?.role === 'admin')
  );

  const { formattedRating, reviewCount } = getReviewStats(listing, listing?.reviews);

  return (
    <div className="container detail-page-container" style={{ paddingBottom: '96px' }}>
      {/* Property Title & Header Meta */}
      <div className="detail-header">
        <h1 className="detail-title">{listing.title}</h1>
        <div className="detail-meta-row">
          <div className="detail-meta-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
              <Star size={16} fill="#F59E0B" color="#F59E0B" />
              <span>{formattedRating}</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>
                · {pluralize(reviewCount, 'review')}
              </span>
            </div>
            <span>·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
              <MapPin size={16} />
              <span style={{ fontWeight: 600, color: 'var(--dark)' }}>
                {listing.location}, {listing.country}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleShare}
              style={{ padding: '8px 14px' }}
              aria-label="Share property"
            >
              <Share2 size={16} />
              <span>{t('detail.share')}</span>
            </button>

            {/* Show Edit and Delete ONLY for property owner */}
            {isOwner && (
              <>
                <Link
                  to={`/listings/${listing._id}/edit`}
                  className="btn btn-secondary"
                  style={{ padding: '8px 14px' }}
                  id="edit-listing-btn"
                  aria-label="Edit listing"
                >
                  <Edit3 size={16} />
                  <span>{t('detail.edit')}</span>
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  style={{ padding: '8px 14px' }}
                  onClick={() => setShowDeleteModal(true)}
                  disabled={deleting}
                  id="delete-listing-btn"
                  aria-label="Delete listing"
                >
                  <Trash2 size={16} />
                  <span>{t('detail.delete')}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero 5-Photo Gallery Grid (1 Large Hero + 4 Small) */}
      <div
        className="detail-gallery-grid"
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr',
          gridTemplateRows: '220px 220px',
          gap: 10,
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: 36,
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Main large photo (spanning 2 rows on the left) */}
        <div
          style={{ gridRow: 'span 2', cursor: 'pointer', overflow: 'hidden' }}
          onClick={() => openLightbox(0)}
        >
          <img
            src={galleryPhotos[0]}
            alt={`${listing.title} main view`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            className="gallery-photo-hover"
          />
        </div>

        {/* 4 smaller thumbnail photos on the right */}
        {galleryPhotos.slice(1, 5).map((photoUrl, idx) => (
          <div
            key={idx + 1}
            style={{ cursor: 'pointer', overflow: 'hidden' }}
            onClick={() => openLightbox(idx + 1)}
          >
            <img
              src={photoUrl}
              alt={`${listing.title} view ${idx + 2}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
              className="gallery-photo-hover"
            />
          </div>
        ))}

        {/* Floating "Show all photos" button */}
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="btn btn-secondary"
          style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            padding: '8px 16px',
            fontSize: '0.88rem',
            fontWeight: 700,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 3,
          }}
          aria-label="Show all gallery photos"
        >
          <Grid size={16} />
          <span>Show all 5 photos</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Photo Lightbox"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFF' }}>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>
              Photo {lightboxIndex + 1} of {galleryPhotos.length}
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              style={{
                color: '#FFF',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Close photo gallery"
            >
              <X size={24} />
            </button>
          </div>

          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              maxHeight: '80vh',
            }}
          >
            <button
              type="button"
              onClick={prevLightboxPhoto}
              style={{
                position: 'absolute',
                left: 16,
                color: '#FFF',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
              }}
              aria-label="Previous photo"
            >
              <ChevronLeft size={28} />
            </button>

            <img
              src={galleryPhotos[lightboxIndex]}
              alt={`${listing.title} full view`}
              style={{
                maxWidth: '90vw',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
              }}
            />

            <button
              type="button"
              onClick={nextLightboxPhoto}
              style={{
                position: 'absolute',
                right: 16,
                color: '#FFF',
                background: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
              }}
              aria-label="Next photo"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, overflowX: 'auto', padding: '10px 0' }}>
            {galleryPhotos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Thumbnail ${i + 1}`}
                onClick={() => setLightboxIndex(i)}
                style={{
                  width: 60,
                  height: 40,
                  objectFit: 'cover',
                  borderRadius: 6,
                  cursor: 'pointer',
                  border: i === lightboxIndex ? '2px solid #FF385C' : '2px solid transparent',
                  opacity: i === lightboxIndex ? 1 : 0.6,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Keyboard Closable with Esc) */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 99998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              maxWidth: 480,
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#DC2626',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={24} />
              </div>
              <h3 id="delete-modal-title" style={{ fontSize: '1.25rem', margin: 0 }}>
                Delete this listing?
              </h3>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: 24 }}>
              Are you sure you want to permanently delete <strong>{listing.title}</strong>? All booking records,
              reviews, and spatial data associated with this property will be removed. This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                style={{ background: '#DC2626', color: '#FFF', borderColor: '#DC2626' }}
                onClick={handleDeleteListing}
                disabled={deleting}
                id="confirm-delete-button"
              >
                {deleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete Property</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smart AI Navigation Tabs with Clear Active Highlights */}
      <div className="detail-nav-tabs" style={{ borderBottom: '2px solid var(--border)', marginBottom: 32 }}>
        <button
          type="button"
          className={`detail-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
          style={{
            fontWeight: activeTab === 'overview' ? 800 : 600,
            borderBottom: activeTab === 'overview' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'overview' ? 'var(--dark)' : 'var(--text-muted)',
            fontSize: '1rem',
            padding: '12px 24px',
          }}
        >
          {t('detail.overviewTab')}
        </button>
        <button
          type="button"
          className={`detail-tab-btn ai-tab ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
          style={{
            fontWeight: activeTab === 'budget' ? 800 : 600,
            borderBottom: activeTab === 'budget' ? '3px solid #7C3AED' : '3px solid transparent',
            color: activeTab === 'budget' ? '#7C3AED' : 'var(--text-muted)',
            fontSize: '1rem',
            padding: '12px 24px',
          }}
        >
          <Calculator size={16} color={activeTab === 'budget' ? '#7C3AED' : 'currentColor'} />
          <span>{t('detail.budgetTab')}</span>
        </button>
        <button
          type="button"
          className={`detail-tab-btn ai-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
          onClick={() => setActiveTab('itinerary')}
          style={{
            fontWeight: activeTab === 'itinerary' ? 800 : 600,
            borderBottom: activeTab === 'itinerary' ? '3px solid #7C3AED' : '3px solid transparent',
            color: activeTab === 'itinerary' ? '#7C3AED' : 'var(--text-muted)',
            fontSize: '1rem',
            padding: '12px 24px',
          }}
        >
          <Compass size={16} color={activeTab === 'itinerary' ? '#7C3AED' : 'currentColor'} />
          <span>{t('detail.itineraryTab')}</span>
        </button>
      </div>

      {/* 2-Column Layout: Left Content & Right Sticky Booking Widget */}
      <div className="detail-content-grid" style={{ alignItems: 'start' }}>
        <div>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Host info and room specs with Superhost badge */}
              <div className="host-section" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <img
                  src={
                    listing.owner?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={listing.owner?.name || 'Host'}
                  className="host-avatar-lg"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <div>
                  <h2 style={{ fontSize: '1.35rem', marginBottom: 4 }}>
                    {t('detail.entireVillaHostedBy')} {listing.owner?.name || 'Elena Rostova'}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        background: '#FEF3C7',
                        color: '#92400E',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      <Award size={13} color="#D97706" /> Superhost
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      ⭐ {formattedRating} Rating · 🛡️ Verified Identity · 5 Years Hosting
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
                    {pluralize(listing.guests || 4, 'guest')} · {pluralize(listing.bedrooms || 1, 'bedroom')} ·{' '}
                    {pluralize(listing.beds || 1, 'bed')} · {pluralize(listing.baths || 1, 'bath')}
                  </p>
                </div>
              </div>

              {/* Highlights badge */}
              <div
                style={{
                  padding: '20px 0',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div style={{ display: 'flex', gap: 16 }}>
                  <ShieldCheck size={24} color="#10B981" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: 2 }}>{t('detail.workspaceHighlight')}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      {t('detail.workspaceDesc')}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <CheckCircle size={24} color="#3B82F6" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: 2 }}>{t('detail.checkinHighlight')}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      {t('detail.checkinDesc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* About this place */}
              <div style={{ padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: 16 }}>{t('detail.aboutThisPlace')}</h3>
                <p
                  style={{
                    color: 'var(--text-main)',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-line',
                    margin: 0,
                  }}
                >
                  {listing.description}
                </p>
              </div>

              {/* Amenities */}
              <div style={{ padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: 16 }}>{t('detail.offers')}</h3>
                <div className="amenities-grid">
                  {(listing.amenities && listing.amenities.length > 0
                    ? listing.amenities
                    : ['Fast WiFi', 'Kitchen', 'Air conditioning', 'Free parking']
                  ).map((amenity, idx) => {
                    const IconComponent = amenityIcons[amenity] || CheckCircle;
                    return (
                      <div key={idx} className="amenity-item">
                        <IconComponent size={20} color="#4B5563" />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Showcase Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #FAF5FF 0%, #FDF2F8 100%)',
                  border: '1px solid #E9D5FF',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  margin: '32px 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Bot size={22} color="#7C3AED" />
                  <h4 style={{ fontSize: '1.15rem', margin: 0, color: '#581C87' }}>
                    {t('detail.planTripWithAi')}
                  </h4>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#6B21A8', margin: '0 0 16px 0' }}>
                  {t('detail.planTripSubtitle')}
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{
                      background: '#FFFFFF',
                      borderColor: '#D8B4FE',
                      color: '#6B21A8',
                      fontSize: '0.88rem',
                    }}
                    onClick={() => setActiveTab('budget')}
                  >
                    <Calculator size={16} />
                    <span>{t('detail.estimateBudgetBtn')}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{
                      background: '#FFFFFF',
                      borderColor: '#D8B4FE',
                      color: '#6B21A8',
                      fontSize: '0.88rem',
                    }}
                    onClick={() => setActiveTab('itinerary')}
                  >
                    <Calendar size={16} />
                    <span>{t('detail.generateItineraryBtn')}</span>
                  </button>
                </div>
              </div>

              {/* Reviews Breakdown Section & Customer Reviews (Single Unified Section) */}
              <div style={{ padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
                <ReviewSection
                  listing={listing}
                  reviews={listing.reviews || []}
                  onReviewUpdated={fetchListing}
                />
              </div>

              {/* Dynamic Map & Location Block ("Where you'll be") */}
              <div style={{ padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: 6 }}>Where you'll be</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: 16 }}>
                  {listing.location}, {listing.country} · Prime scenic neighborhood with world-class dining, safe surroundings, and easy local transit.
                </p>
                <PropertyMap
                  coordinates={listing.geometry?.coordinates}
                  title={listing.title}
                  location={listing.location}
                  country={listing.country}
                />
              </div>

              {/* House Rules & Policies Section */}
              <div style={{ padding: '24px 0', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: 18 }}>Things to know</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
                  {/* House Rules */}
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={18} color="#4B5563" /> House rules
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <li>Check-in: 3:00 PM – 9:00 PM</li>
                      <li>Checkout before 11:00 AM</li>
                      <li>Maximum {pluralize(listing.guests || 4, 'guest')}</li>
                      <li>Self check-in with keypad</li>
                    </ul>
                  </div>

                  {/* Safety & Property */}
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Ban size={18} color="#4B5563" /> Safety & property
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <li>Carbon monoxide alarm installed</li>
                      <li>Smoke alarm fitted</li>
                      <li>No commercial photography</li>
                      <li>No smoking on premises</li>
                    </ul>
                  </div>

                  {/* Cancellation policy */}
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <HeartHandshake size={18} color="#4B5563" /> Cancellation policy
                    </h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      Free cancellation for 48 hours. Cancel before check-in date for a partial refund as per Wanderlust Superhost guarantee.
                    </p>
                  </div>
                </div>
              </div>

              {/* Similar Stays Row */}
              {similarListings.length > 0 && (
                <div style={{ padding: '36px 0 12px' }}>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: 18 }}>Similar stays you may like</h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                      gap: 20,
                    }}
                  >
                    {similarListings.map((simListing) => (
                      <ListingCard key={simListing._id} listing={simListing} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 2: AI TRIP BUDGET & EXPENSE ESTIMATOR */}
          {activeTab === 'budget' && (
            <div>
              <AIBudgetEstimator listing={listing} />
            </div>
          )}

          {/* TAB 3: AI SMART ITINERARY */}
          {activeTab === 'itinerary' && (
            <div>
              <AISmartItinerary listing={listing} />
            </div>
          )}
        </div>

        {/* Right Sticky Reservation Widget */}
        <div style={{ position: 'sticky', top: '96px' }}>
          <BookingWidget listing={listing} />
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;
