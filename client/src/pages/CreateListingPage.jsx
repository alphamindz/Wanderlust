import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Upload, Check } from 'lucide-react';
import AIHostAssistant from '../components/AIHostAssistant';

const CATEGORIES = [
  'Trending',
  'Beachfront',
  'Iconic Cities',
  'Castles',
  'Cabins',
  'Mansions',
  'Camping',
  'Arctic',
  'Lakefront',
];

const AVAILABLE_AMENITIES = [
  'Fast WiFi',
  'Kitchen',
  'Infinity Pool',
  'Free parking',
  'Air conditioning',
  'Hot Tub',
  'Dedicated Workspace',
  'Matterhorn Views',
  'Aegean Sea View',
  'Ski-in / Ski-out',
  'Rooftop Zen Garden',
];

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, showToast } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    category: 'Trending',
    imageUrl: '',
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
  });

  const [selectedAmenities, setSelectedAmenities] = useState([
    'Fast WiFi',
    'Kitchen',
    'Free parking',
  ]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [submitting, setSubmitting] = useState(false);

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in before hosting a home', 'error');
      navigate('/login');
      return;
    }

    if (!formData.title || !formData.price || !formData.location || !formData.country) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('location', formData.location);
      data.append('country', formData.country);
      data.append('category', formData.category);
      data.append('guests', formData.guests);
      data.append('bedrooms', formData.bedrooms);
      data.append('beds', formData.beds);
      data.append('baths', formData.baths);
      data.append('amenities', JSON.stringify(selectedAmenities));

      if (uploadMode === 'file' && imageFile) {
        data.append('image', imageFile);
      } else if (formData.imageUrl) {
        data.append('imageUrl', formData.imageUrl);
      }

      const response = await api.post('/listings', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showToast('Your property has been published on Wanderlust!');
      navigate(`/listings/${response.data.listing._id}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create listing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0 80px' }}>
      <div className="form-card">
        <h1 style={{ fontSize: '1.85rem', marginBottom: 6 }}>Wanderlust your home</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '0.95rem' }}>
          Share your extraordinary space with discerning travelers worldwide.
        </p>

        {/* AI Description & Title Assistant */}
        <AIHostAssistant
          location={formData.location}
          category={formData.category}
          onApplyTitle={(title) => setFormData((prev) => ({ ...prev, title }))}
          onApplyDescription={(description) =>
            setFormData((prev) => ({ ...prev, description }))
          }
          onApplyAmenities={(newAmenities) =>
            setSelectedAmenities((prev) =>
              Array.from(new Set([...prev, ...newAmenities]))
            )
          }
        />

        <form onSubmit={handleSubmit} id="create-listing-form">
          <div className="form-group">
            <label className="form-label">Property Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Cliffside Villa with Private Infinity Pool"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-control"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price per Night ($ USD) *</label>
              <input
                type="number"
                min="10"
                className="form-control"
                placeholder="450"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">City / Destination *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Oia, Santorini"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Country *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Greece"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Image source switch: File Upload or Image URL */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label className="form-label" style={{ margin: 0 }}>
                Property Cover Photo *
              </label>
              <div style={{ display: 'flex', gap: 12, fontSize: '0.82rem', fontWeight: 600 }}>
                <button
                  type="button"
                  style={{
                    color: uploadMode === 'file' ? '#FF385C' : '#6B7280',
                    textDecoration: uploadMode === 'file' ? 'underline' : 'none',
                  }}
                  onClick={() => setUploadMode('file')}
                >
                  Upload File
                </button>
                <span>·</span>
                <button
                  type="button"
                  style={{
                    color: uploadMode === 'url' ? '#FF385C' : '#6B7280',
                    textDecoration: uploadMode === 'url' ? 'underline' : 'none',
                  }}
                  onClick={() => setUploadMode('url')}
                >
                  Paste Image URL
                </button>
              </div>
            </div>

            {uploadMode === 'file' ? (
              <div
                style={{
                  border: '2px dashed var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '28px',
                  textAlign: 'center',
                  background: '#F9FAFB',
                  cursor: 'pointer',
                }}
                onClick={() => document.getElementById('file-upload-input').click()}
              >
                <input
                  id="file-upload-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <Upload size={32} color="#9CA3AF" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontWeight: 600, color: 'var(--dark)', fontSize: '0.9rem' }}>
                  {imageFile ? imageFile.name : 'Click to upload property image (PNG, JPG, WebP)'}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Cloudinary / Multer optimized media pipeline (Max 5MB)
                </p>
              </div>
            ) : (
              <input
                type="url"
                className="form-control"
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.imageUrl}
                onChange={(e) => {
                  setFormData({ ...formData, imageUrl: e.target.value });
                  setImagePreview(e.target.value);
                }}
              />
            )}

            {imagePreview && (
              <div style={{ marginTop: 12, borderRadius: 'var(--radius-md)', overflow: 'hidden', height: 180 }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Describe what makes your space special, the surroundings, and architecture..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Specs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>
                Guests
              </label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>
                Bedrooms
              </label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>
                Beds
              </label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={formData.beds}
                onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>
                Baths
              </label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={formData.baths}
                onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
              />
            </div>
          </div>

          {/* Amenities selection */}
          <div className="form-group">
            <label className="form-label">Popular Amenities</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    type="button"
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: isSelected ? '1px solid #FF385C' : '1px solid var(--border)',
                      background: isSelected ? '#FFF1F2' : '#FFFFFF',
                      color: isSelected ? '#FF385C' : 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {isSelected && <Check size={14} />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: 12 }}
            disabled={submitting}
            id="publish-listing-submit-btn"
          >
            {submitting ? 'Publishing Property...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;
