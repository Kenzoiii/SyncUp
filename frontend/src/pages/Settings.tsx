import React, { useEffect, useState } from 'react';
import { usersAPI, UserProfile, authAPI } from '../services/api';
import '../styles/Dashboard.css';

const Settings: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const me = await usersAPI.getMe();
        setProfile(me);
        setFullName(me.fullName);
      } catch (e) {}
    };
    load();
  }, []);

  const onSave = async () => {
    // Non-functional placeholder: show animation/message only
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setMessage('Changes previewed (not saved).');
    }, 600);
  };

  const onLogout = async () => {
    await authAPI.logout();
    window.location.href = '/login';
  };

  if (!profile) return <div className="dashboard">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="main-content">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Settings</h1>
            <div className="user-score">Manage your profile</div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="left-column">
            <div className="widget">
              <div className="widget-header"><h3>Profile</h3></div>
              <div className="settings-form">
                <label>Email</label>
                <input value={profile.email} disabled className="input" />

                <label>Full name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />

                <label>New password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" placeholder="Preview only" />

                <button className="btn btn-primary" onClick={onSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                {message && <div className="info-text" style={{ marginTop: 8 }}>{message}</div>}
              </div>
            </div>
          </div>

          <div className="right-column">
            <div className="widget">
              <div className="widget-header"><h3>Account</h3></div>
              <button className="btn btn-secondary" onClick={() => setShowLogoutConfirm(true)}>Log out</button>
            </div>
          </div>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={onLogout}>Log out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;


