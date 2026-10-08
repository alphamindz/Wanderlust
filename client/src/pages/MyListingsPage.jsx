import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Edit3, Trash2, Eye, Star, Loader2, AlertTriangle, Building2 } from 'lucide-react';
import { formatPrice, formatRating } from '../utils/formatters';

const MyListingsPage = () => {
  const { isAuthenticated, loading: authLoading, showToast } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [deleting, setDeleting] = useState(false);

  const fetchMyListings = useCallback(async () => {
    try {
      const res = await api.get('/listings/user/my-listings');
      setListings(res.data.listings || []);
    } catch (err) {
      console.error('Error fetching user listings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      showToast('Please log in to view your hosted properties', 'error');
      navigate('/login', { state: { from: { pathname: '/my-listings' } } });
      return;
    }

    fetchMyListings();
  }, [isAuthenticated, authLoading, navigate, showToast, fetchMyListings]);

  // Handle Escape key for Delete modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && deleteTarget) {
        setDeleteTarget(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteTarget]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      await api.delete(`/listings/${deleteTarget.id}`);
      showToast('Listing removed successfully');
      setListings((prev) => prev.filter((item) => item._id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete listing', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={40} color="#FF385C" className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px 96px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 36,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Building2 size={26} color="#FF385C" />
            <h1 style={{ fontSize: '2rem', margin: 0 }}>My Hosted Properties</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
            Manage your active vacation rentals, update rates, view bookings, and host new stays.
          </p>
        </div>

        <Link to="/listings/new" className="btn btn-primary" id="add-new-listing-btn">
          <PlusCircle size={18} />
          <span>Host a New Stay</span>
        </Link>
      </div>

      {/* Empty State */}
      {listings.length === 0 ? (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '60px 20px',
            textAlign: 'center',
            maxWidth: 540,
            margin: '0 auto',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <Building2 size={48} color="#FF385C" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ marginBottom: 8, fontSize: '1.4rem' }}>You haven't listed any properties yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.92rem' }}>
            Join thousands of Wanderlust hosts welcoming travelers from around the globe.
          </p>
          <Link to="/listings/new" className="btn btn-primary">
            Create Your First Listing
          </Link>
        </div>
      ) : (
        /* 4-Card Responsive Grid */
        <div
          className="my-listings-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 24,
          }}
        >
          {listings.map((item) => {
            const imageUrl =
              item.image?.url ||
              (Array.isArray(item.images) && item.images[0]) ||
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80';
            const ratingVal = formatRating(item.averageRating, 4.9);

            return (
              <div
                key={item._id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Card Media with Category Badge */}
                <div style={{ height: 190, position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={imageUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
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
                      }}
                    >
                      {item.category || 'Featured'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <h3
                      style={{
                        fontSize: '1.02rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        flex: 1,
                        margin: 0,
                      }}
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        fontWeight: 700,
                        fontSize: '0.86rem',
                        marginLeft: 8,
                        flexShrink: 0,
                      }}
                    >
                      <Star size={14} fill="#F59E0B" color="#F59E0B" />
                      <span>{ratingVal}</span>
                    </div>
                  </div>

                  <p
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      marginBottom: 12,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.location}, {item.country}
                  </p>

                  <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 16 }}>
                    {formatPrice(item.price)}{' '}
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                      / night
                    </span>
                  </div>

                  {/* Actions Row */}
                  <div
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      gap: 8,
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: 12,
                    }}
                  >
                    <Link
                      to={`/listings/${item._id}`}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '8px 10px', fontSize: '0.84rem' }}
                      aria-label={`View ${item.title}`}
                    >
                      <Eye size={15} />
                      <span>View</span>
                    </Link>
                    <Link
                      to={`/listings/${item._id}/edit`}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '8px 10px', fontSize: '0.84rem' }}
                      aria-label={`Edit ${item.title}`}
                    >
                      <Edit3 size={15} />
                      <span>Edit</span>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      style={{ padding: '8px 12px' }}
                      onClick={() => setDeleteTarget({ id: item._id, title: item.title })}
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
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
          aria-labelledby="delete-property-modal-title"
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
              <h3 id="delete-property-modal-title" style={{ fontSize: '1.25rem', margin: 0 }}>
                Delete property?
              </h3>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: 24 }}>
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>? This action cannot be undone.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                style={{ background: '#DC2626', color: '#FFF', borderColor: '#DC2626' }}
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;
