import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/client';
import CategoriesBar from '../components/CategoriesBar';
import ListingCard from '../components/ListingCard';
import { Map, List, Loader2, Sparkles } from 'lucide-react';
import L from 'leaflet';

const HomePage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'All';

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [showMap, setShowMap] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  // Fetch listings on filter change
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory && activeCategory !== 'All') {
          params.category = activeCategory;
        }
        if (searchParam) {
          params.search = searchParam;
        }

        const res = await api.get('/listings', { params });
        setListings(res.data.listings || []);
      } catch (err) {
        console.error('Failed to load listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [activeCategory, searchParam]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setActiveCategory('All');
    setSearchParams({});
  };

  return (
    <main style={{ flex: 1, paddingBottom: '96px' }}>
      {/* Category Pills Header */}
      <CategoriesBar
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
      />

      <div className="container" style={{ position: 'relative', paddingBottom: '24px' }}>
        {/* Active Search / Filter Banner if filtering */}
        {(searchParam || (activeCategory && activeCategory !== 'All')) && (
          <div
            style={{
              padding: '16px 0 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {t('home.showingPropertiesFor')}
              </span>
              {searchParam && (
                <span
                  style={{
                    background: '#FFF1F2',
                    color: '#FF385C',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  "{searchParam}"
                </span>
              )}
              {activeCategory !== 'All' && (
                <span
                  style={{
                    background: '#EFF6FF',
                    color: '#2563EB',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  {t(`categories.${activeCategory}`, activeCategory)}
                </span>
              )}
            </div>

            <button
              onClick={handleClearFilters}
              style={{
                fontSize: '0.85rem',
                color: '#6B7280',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {t('home.clearAll')}
            </button>
          </div>
        )}

        {/* Floating Map / List Toggle Button */}
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
          }}
        >
          <button
            className="btn btn-dark"
            style={{
              padding: '12px 24px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              fontSize: '0.95rem',
            }}
            onClick={() => setShowMap(!showMap)}
            id="toggle-map-view-button"
          >
            {showMap ? (
              <>
                <List size={18} />
                <span>{t('home.showList')}</span>
              </>
            ) : (
              <>
                <Map size={18} />
                <span>{t('home.showMap')}</span>
              </>
            )}
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '120px 0',
              gap: 16,
              color: 'var(--text-muted)',
            }}
          >
            <Loader2 size={36} className="animate-spin text-primary" color="#FF385C" />
            <p style={{ fontWeight: 600 }}>{t('home.verifiedStays')}...</p>
          </div>
        ) : showMap ? (
          <ExploreMap listings={listings} />
        ) : listings.length > 0 ? (
          <div className="listings-grid" id="listings-grid-container">
            {listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              maxWidth: 520,
              margin: '0 auto',
            }}
          >
            <Sparkles size={48} color="#FF385C" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: 8 }}>{t('home.noListingsFound')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
              {t('home.noListingsSubtitle')}
            </p>
            <button onClick={handleClearFilters} className="btn btn-primary">
              {t('home.clearAllFilters')}
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

// Full Explore Map with all listings
const ExploreMap = ({ listings }) => {
  const mapRef = React.useRef(null);
  const mapInstance = React.useRef(null);

  React.useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    try {
      const map = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2.5,
        minZoom: 2,
      });

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          maxZoom: 19,
        }
      ).addTo(map);

      // Add pins for listings with valid coordinates
      const bounds = [];
      listings.forEach((listing) => {
        if (
          listing.geometry &&
          listing.geometry.coordinates &&
          listing.geometry.coordinates.length === 2
        ) {
          const [lng, lat] = listing.geometry.coordinates;
          if (lat && lng) {
            bounds.push([lat, lng]);

            const priceMarker = L.divIcon({
              className: 'price-map-marker',
              html: `
                <div style="
                  background: #FFFFFF;
                  color: #111827;
                  font-weight: 800;
                  font-family: 'Plus Jakarta Sans', sans-serif;
                  font-size: 0.85rem;
                  padding: 6px 10px;
                  border-radius: 20px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.18);
                  border: 1px solid #E5E7EB;
                  white-space: nowrap;
                  transform: translate(-50%, -50%);
                  transition: transform 0.2s ease;
                ">
                  $${listing.price}
                </div>
              `,
              iconSize: [60, 30],
            });

            const marker = L.marker([lat, lng], { icon: priceMarker }).addTo(map);

            const popupContent = `
              <div style="font-family: 'Plus Jakarta Sans', sans-serif; width: 220px; padding: 4px;">
                <img src="${
                  listing.image?.url ||
                  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'
                }" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
                <h4 style="font-size: 0.95rem; font-weight: 700; margin: 0 0 4px 0; color: #111827;">${
                  listing.title
                }</h4>
                <p style="font-size: 0.8rem; color: #6B7280; margin: 0 0 6px 0;">${
                  listing.location
                }, ${listing.country}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 800; color: #111827;">$${listing.price} <span style="font-weight: 400; color: #6B7280; font-size: 0.75rem;">night</span></span>
                  <a href="/listings/${listing._id}" style="color: #FF385C; font-weight: 700; font-size: 0.8rem;">View Stay →</a>
                </div>
              </div>
            `;

            marker.bindPopup(popupContent);
          }
        }
      });

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
      }

      mapInstance.current = map;
    } catch (e) {
      console.error('Error loading explore map:', e);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [listings]);

  return (
    <div
      style={{
        height: 'calc(100vh - 180px)',
        minHeight: 500,
        margin: '24px 0 60px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border)',
      }}
      ref={mapRef}
      id="explore-map-container"
    ></div>
  );
};

export default HomePage;
