import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Star, Trash2, Send, X, MessageSquarePlus, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pluralize, getReviewStats } from '../utils/formatters';

const ReviewSection = ({ listing, reviews = [], onReviewUpdated }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated, showToast } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);

  // Derive stats, categories, and reviews from single helper
  const { formattedRating, reviewCount, categories, reviewsList } = getReviewStats(
    listing,
    reviews
  );

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showAllModal) {
        setShowAllModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAllModal]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please log in to submit a review', 'error');
      return;
    }
    if (!comment.trim()) {
      showToast('Please write a brief comment with your review', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/listings/${listing?._id}/reviews`, {
        rating,
        comment: comment.trim(),
      });
      showToast('Thank you! Your review has been published.');
      setComment('');
      setRating(5);
      if (onReviewUpdated) onReviewUpdated();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    try {
      await api.delete(`/listings/${listing?._id}/reviews/${reviewId}`);
      showToast('Review removed successfully');
      if (onReviewUpdated) onReviewUpdated();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete review', 'error');
    }
  };

  const hasUserReviewed =
    isAuthenticated &&
    user &&
    reviews.some((r) => {
      const authorId = r.author?._id || r.author?.id || r.author;
      const currentUserId = user?._id || user?.id;
      return authorId && currentUserId && String(authorId) === String(currentUserId);
    });

  // Display top 6 reviews on the page
  const displayedReviews = reviewsList.slice(0, 6);

  return (
    <div className="reviews-section" id="listing-reviews-section">
      {/* 1. Single Unified Review Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <Star size={24} fill="#F59E0B" color="#F59E0B" />
        <h3 style={{ fontSize: '1.45rem', margin: 0, fontWeight: 800, color: 'var(--dark)' }}>
          {formattedRating} · {pluralize(reviewCount, 'review')}
        </h3>
      </div>

      {/* 2. Rating Breakdown Bars (6 categories with role=progressbar) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '14px 36px',
          marginBottom: 32,
        }}
      >
        {categories.map((cat, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <span style={{ fontSize: '0.92rem', color: 'var(--text-main)', minWidth: 120 }}>
              {cat.label}
            </span>
            <div
              style={{
                flex: 1,
                height: 5,
                background: '#E5E7EB',
                borderRadius: 9999,
                overflow: 'hidden',
              }}
              role="progressbar"
              aria-valuenow={cat.value}
              aria-valuemin="0"
              aria-valuemax="5"
              aria-label={cat.label}
            >
              <div
                style={{
                  height: '100%',
                  width: cat.width,
                  background: '#111827',
                  borderRadius: 9999,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '0.86rem',
                fontWeight: 700,
                minWidth: 26,
                textAlign: 'right',
                color: 'var(--dark)',
              }}
            >
              {cat.score}
            </span>
          </div>
        ))}
      </div>

      {/* 3. 6 Reviews in 2-Column Grid (1 col on mobile) */}
      <div
        className="reviews-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px 28px',
          marginBottom: 28,
        }}
      >
        {displayedReviews.map((review) => {
          const author = review.author || {};
          const currentUserId = user?._id || user?.id;
          const authorId = author?._id || author?.id || author;
          const isAuthor = Boolean(
            isAuthenticated &&
              user &&
              currentUserId &&
              authorId &&
              review.isUserSubmitted &&
              (String(currentUserId) === String(authorId) || user?.role === 'admin')
          );

          return (
            <div
              key={review._id}
              className="review-card"
              style={{
                background: '#FAFAFA',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Author Info & Stay Tag */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={
                        author.avatar ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={author.name || 'Traveler'}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1.5px solid #FFFFFF',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--dark)' }}>
                        {author.name || 'Verified Traveler'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {review.date || 'Recently'}
                      </div>
                    </div>
                  </div>

                  {isAuthor && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="btn btn-outline-danger"
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      title={t('reviews.deleteReview')}
                      aria-label="Delete my review"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>

                {/* Rating Stars + Stayed Duration Tag */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={13}
                        fill={idx < (review.rating || 5) ? '#F59E0B' : '#E5E7EB'}
                        color={idx < (review.rating || 5) ? '#F59E0B' : '#E5E7EB'}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      background: '#F3F4F6',
                      color: '#4B5563',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {review.stayDuration || 'Stayed 3 nights'}
                  </span>
                </div>

                {/* Review Text */}
                <p
                  style={{
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {review.comment}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show All Reviews Button */}
      {reviewsList.length > 6 && (
        <div style={{ marginBottom: 36 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowAllModal(true)}
            style={{
              padding: '10px 22px',
              fontSize: '0.92rem',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
            }}
            id="show-all-reviews-btn"
          >
            Show all {reviewCount} reviews
          </button>
        </div>
      )}

      {/* 4. Compact "Share Your Experience" Box Below Reviews List */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <MessageSquarePlus size={18} color="#FF385C" />
          <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
            {t('reviews.writeReview')}
          </h4>
        </div>

        {isAuthenticated ? (
          hasUserReviewed ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                color: '#065F46',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              <ShieldCheck size={18} color="#059669" />
              <span>You have already reviewed this stay. Thank you for your feedback!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 12,
                  flexWrap: 'wrap',
                }}
              >
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--dark)' }}>
                  {t('reviews.yourRating')}:
                </label>
                <div style={{ display: 'flex', gap: 4, cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                      }}
                      aria-label={`${star} star rating`}
                    >
                      <Star
                        size={22}
                        fill={(hoverRating || rating) >= star ? '#F59E0B' : '#E5E7EB'}
                        color={(hoverRating || rating) >= star ? '#F59E0B' : '#D1D5DB'}
                      />
                    </button>
                  ))}
                  <span
                    style={{
                      marginLeft: 8,
                      fontWeight: 700,
                      color: '#4B5563',
                      fontSize: '0.88rem',
                      alignSelf: 'center',
                    }}
                  >
                    {rating} / 5
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder={t('reviews.placeholder')}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{
                    fontSize: '0.9rem',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  id="submit-review-button"
                  style={{ padding: '8px 18px', fontSize: '0.9rem' }}
                >
                  <Send size={15} />
                  <span>{submitting ? t('reviews.submitting') : t('reviews.postReview')}</span>
                </button>
              </div>
            </form>
          )
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              background: '#F9FAFB',
              border: '1px solid var(--border)',
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              flexWrap: 'wrap',
            }}
          >
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              {t('reviews.signInPrompt')}
            </p>
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: '0.88rem', fontWeight: 700 }}
              id="signin-to-review-btn"
            >
              {t('reviews.signInToReview')}
            </Link>
          </div>
        )}
      </div>

      {/* All Reviews Modal (Keyboard Closable with Esc) */}
      {showAllModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99998,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
          role="dialog"
          aria-modal="true"
          aria-label="All guest reviews"
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              maxWidth: 760,
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Star size={22} fill="#F59E0B" color="#F59E0B" />
                <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 800 }}>
                  {formattedRating} · {pluralize(reviewCount, 'review')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAllModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 6,
                  color: '#6B7280',
                  borderRadius: '50%',
                }}
                aria-label="Close reviews modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Reviews List */}
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {reviewsList.map((review) => {
                const author = review.author || {};
                return (
                  <div
                    key={review._id}
                    style={{
                      borderBottom: '1px solid var(--border-light)',
                      paddingBottom: 16,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <img
                        src={
                          author.avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={author.name || 'Traveler'}
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                          {author.name || 'Verified Traveler'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {review.date || 'Recently'} · {review.stayDuration || 'Stayed 3 nights'}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          size={12}
                          fill={idx < (review.rating || 5) ? '#F59E0B' : '#E5E7EB'}
                          color={idx < (review.rating || 5) ? '#F59E0B' : '#E5E7EB'}
                        />
                      ))}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                      {review.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
