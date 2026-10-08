import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';
import WLogo from '../components/WLogo';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(formData);
    setLoading(false);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
      }}
    >
      <div className="form-card" style={{ width: '100%', maxWidth: '460px', margin: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <WLogo size={48} />
          </div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: 6 }}>Join Wanderlust</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Discover breathtaking stays and host worldwide travelers
          </p>
        </div>

        <form onSubmit={handleSubmit} id="signup-form">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Maya Chen"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              id="signup-name-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email address *</label>
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              id="signup-email-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="form-control"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
              id="signup-password-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avatar URL (Optional)</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Short Bio (Optional)</label>
            <textarea
              className="form-control"
              rows={2}
              placeholder="Tell hosts and guests a bit about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: 8 }}
            disabled={loading}
            id="signup-submit-btn"
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            marginTop: 20,
          }}
        >
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#FF385C', fontWeight: 700 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
