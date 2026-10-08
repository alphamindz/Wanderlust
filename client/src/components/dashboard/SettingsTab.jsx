import React, { useState } from 'react';
import {
  Camera,
  Lock,
  Bell,
  Trash2,
  ShieldAlert,
} from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const SettingsTab = ({
  user,
  onSaveProfile,
  onSavePassword,
  onDeleteAccount,
  showToast,
}) => {
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Elena Rostova',
    email: user?.email || 'host@wanderlust.com',
    phone: user?.phone || '+1 (555) 234-5678',
    bio: user?.bio || 'Superhost of architectural gems and seaside sanctuaries. Passionate about world design and luxury hospitality.',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    bookingAlerts: true,
    guestMessages: true,
    aiPriceTips: true,
    promotions: false,
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({ ...prev, avatar: reader.result }));
        if (showToast) showToast('Avatar preview updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      if (onSaveProfile) onSaveProfile(profileData);
      if (showToast) showToast('Profile settings saved successfully!');
    }, 600);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      if (showToast) showToast('New passwords do not match', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      if (showToast) showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      if (onSavePassword) onSavePassword();
      if (showToast) showToast('Password updated successfully!');
    }, 600);
  };

  const handleConfirmDeleteAccount = () => {
    setDeletingAccount(true);
    setTimeout(() => {
      setDeletingAccount(false);
      setShowDeleteModal(false);
      if (onDeleteAccount) onDeleteAccount();
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Top Header */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 4px 0' }}>
          Account & Profile Settings
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
          Manage your public host identity, login credentials, and communication preferences.
        </p>
      </div>

      {/* 1. Public Profile Form */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 20 }}>
          Public Profile & Host Details
        </h3>

        <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Avatar Upload Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <img
                src={profileData.avatar}
                alt="Profile Avatar"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #FFF',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                }}
              />
              <label
                htmlFor="avatar-upload-input"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: '#FF385C',
                  color: '#FFF',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
                title="Change Photo"
              >
                <Camera size={14} />
              </label>
              <input
                id="avatar-upload-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Profile Picture</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                PNG, JPG or WEBP. High-resolution portrait recommended.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-control"
                value={profileData.email}
                disabled
                style={{ backgroundColor: '#F9FAFB', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Host Bio & About Me</label>
            <textarea
              className="form-control"
              rows={4}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              placeholder="Tell guests about your background, hosting philosophy, and local insights..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingProfile}
              style={{ padding: '10px 24px', fontWeight: 700 }}
            >
              {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Password & Security Form */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Lock size={20} color="#FF385C" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
            Change Password & Security
          </h3>
        </div>

        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="At least 6 characters"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={6}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={savingPassword}
              style={{ padding: '10px 24px', fontWeight: 700 }}
            >
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* 3. Notification Preferences */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Bell size={20} color="#7C3AED" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
            Notification Preferences
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            {
              key: 'bookingAlerts',
              title: 'Reservation Requests & Bookings',
              desc: 'Instant notifications when a guest requests or books a stay.',
            },
            {
              key: 'guestMessages',
              title: 'Guest Inquiries & Messages',
              desc: 'Receive alerts when a traveler sends you a direct message.',
            },
            {
              key: 'aiPriceTips',
              title: 'Wanderlust AI Pricing & Demand Alerts',
              desc: 'Smart recommendations for upcoming peak weekends and seasonal trends.',
            },
            {
              key: 'promotions',
              title: 'Marketplace Insights & Updates',
              desc: 'Monthly host community stories and global travel report briefings.',
            },
          ].map((item) => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--dark)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {item.desc}
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={(e) =>
                  setNotifications({ ...notifications, [item.key]: e.target.checked })
                }
                style={{
                  width: 18,
                  height: 18,
                  accentColor: '#FF385C',
                  cursor: 'pointer',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Danger Zone */}
      <div
        style={{
          background: '#FFF5F5',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid #FECACA',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <ShieldAlert size={22} color="#DC2626" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#991B1B' }}>
            Danger Zone
          </h3>
        </div>

        <p style={{ color: '#7F1D1D', fontSize: '0.88rem', lineHeight: 1.5, margin: '0 0 20px 0' }}>
          Permanently delete your Wanderlust account and all associated property listings, reviews, and reservation history. This action cannot be undone.
        </p>

        <button
          type="button"
          className="btn btn-outline-danger"
          style={{ backgroundColor: '#DC2626', color: '#FFF', borderColor: '#DC2626', padding: '10px 20px', fontWeight: 700 }}
          onClick={() => setShowDeleteModal(true)}
        >
          <Trash2 size={16} />
          <span>Delete Account</span>
        </button>
      </div>

      {/* Delete Account Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDeleteAccount}
        title="Permanently Delete Wanderlust Account?"
        message="Are you absolutely sure? All your hosted sanctuaries, traveler reviews, and payment history will be permanently deleted from the database."
        confirmText="Yes, Permanently Delete"
        isDanger={true}
        loading={deletingAccount}
      />
    </div>
  );
};

export default SettingsTab;
