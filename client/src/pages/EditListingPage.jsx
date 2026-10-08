import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Check, Loader2 } from 'lucide-react';
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

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, showToast } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      showToast('Please log in to edit this listing', 'error');
      navigate('/login', { state: { from: { pathname: `/listings/${id}/edit` } } });
      return;
    }

    const fetchListing = async () => {
      try {
        const res = await api.get(`/listings/${id}`);
        const data = res.data.listing;

        const currentUserId = user?._id || user?.id;
        const ownerId = data.owner?._id || data.owner?.id || data.owner;
        const isOwner = Boolean(
          user &&
            currentUserId &&
            ownerId &&
            (String(currentUserId) === String(ownerId) || user?.role === 'admin')
        );

        if (!isOwner) {
          showToast('You are not authorized to edit this listing', 'error');
          navigate(`/listings/${id}`);
          return;
        }

        setFormData({
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location,
          country: data.country,
          category: data.category || 'Trending',
          imageUrl: data.image?.url || '',
          guests: data.guests || 2,
          bedrooms: data.bedrooms || 1,
          beds: data.beds || 1,
          baths: data.baths || 1,
        });

        setSelectedAmenities(data.amenities || []);
        setImagePreview(data.image?.url || '');
      } catch {
        showToast('Error loading listing data', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, isAuthenticated, authLoading, user]);

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

      if (imageFile) {
        data.append('image', imageFile);
      } else if (formData.imageUrl) {
        data.append('imageUrl', formData.imageUrl);
      }

      await api.put(`/listings/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      showToast('Property details updated successfully!');
      navigate(`/listings/${id}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update listing', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <Loader2 size={36} color="#FF385C" className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0 80px' }}>
      <div className="form-card">
        <h1 style={{ fontSize: '1.85rem', marginBottom: 6 }}>Edit Property Details</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: '0.95rem' }}>
          Update pricing, imagery, or description for your guests.
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Property Title</label>
            <input
              type="text"
              className="form-control"
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
              <label className="form-label">Price per Night ($ USD)</label>
              <input
                type="number"
                className="form-control"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">City / Destination</label>
              <input
                type="text"
                className="form-control"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Update Image (File or URL)</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleFileChange}
              style={{ marginBottom: 8 }}
            />
            <input
              type="url"
              className="form-control"
              placeholder="Or enter image URL"
              value={formData.imageUrl}
              onChange={(e) => {
                setFormData({ ...formData, imageUrl: e.target.value });
                setImagePreview(e.target.value);
              }}
            />

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
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amenities</label>
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
          >
            {submitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditListingPage;
