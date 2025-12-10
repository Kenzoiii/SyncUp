import React, { useState, useEffect } from 'react';
import { User, Lock, CheckCircle, AlertCircle, LogOut } from 'lucide-react';
import { usersAPI, authAPI } from '../services/api'; // Import authAPI for logout
import '../styles/Dashboard.css';

const Settings: React.FC = () => {
  // --- Profile State ---
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // --- Password State ---
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Load initial data
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      setFullName(user.fullName);
      setEmail(user.email);
    }
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });

    try {
      await usersAPI.updateProfile(fullName);

      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        user.fullName = fullName;
        localStorage.setItem('user', JSON.stringify(user));
        window.dispatchEvent(new Event("storage"));
      }

      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });

    try {
      await usersAPI.changePassword(passwords.oldPassword, passwords.newPassword);
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to change password.';
      setPasswordMessage({ type: 'error', text: msg });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      authAPI.logout();
    }
  };

  return (
      <div className="dashboard">
        <div className="main-content">
          <div className="dashboard-header">
            <div className="welcome-section">
              <h1>Account Settings</h1>
              <div className="user-score">Manage your profile and security</div>
            </div>
          </div>

          <div className="dashboard-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>

            {/* --- SECTION 1: PROFILE --- */}
            <div className="widget">
              <div className="widget-header">
                <h3><User size={20} /> Personal Information</h3>
              </div>

              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label style={{ color: '#888', marginBottom: '8px', display: 'block' }}>Email Address</label>
                  <input
                      className="input"
                      value={email}
                      disabled
                      style={{ opacity: 0.7, cursor: 'not-allowed' }}
                  />
                  <span style={{ fontSize: '12px', color: '#666' }}>Email cannot be changed directly.</span>
                </div>

                <div className="form-group">
                  <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>Full Name</label>
                  <input
                      className="input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                  />
                </div>

                {profileMessage.text && (
                    <div style={{
                      padding: '10px', borderRadius: '8px', fontSize: '14px',
                      backgroundColor: profileMessage.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                      color: profileMessage.type === 'success' ? '#4caf50' : '#f44336',
                      display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      {profileMessage.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                      {profileMessage.text}
                    </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={profileLoading}>
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            {/* --- SECTION 2: PASSWORD --- */}
            <div className="widget">
              <div className="widget-header">
                <h3><Lock size={20} /> Change Password</h3>
              </div>

              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div className="form-group">
                  <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>Current Password</label>
                  <input
                      type="password"
                      className="input"
                      placeholder="Enter current password"
                      value={passwords.oldPassword}
                      onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                      required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>New Password</label>
                    <input
                        type="password"
                        className="input"
                        placeholder="New password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                        required
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ color: 'white', marginBottom: '8px', display: 'block' }}>Confirm New Password</label>
                    <input
                        type="password"
                        className="input"
                        placeholder="Confirm new password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                        required
                    />
                  </div>
                </div>

                {passwordMessage.text && (
                    <div style={{
                      padding: '10px', borderRadius: '8px', fontSize: '14px',
                      backgroundColor: passwordMessage.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                      color: passwordMessage.type === 'success' ? '#4caf50' : '#f44336',
                      display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      {passwordMessage.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                      {passwordMessage.text}
                    </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={passwordLoading}>
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* --- SECTION 3: LOGOUT (Added Back) --- */}
            <div className="widget" style={{ borderColor: '#f44336' }}>
              <div className="widget-header">
                <h3 style={{ color: '#f44336' }}><LogOut size={20} /> Account Actions</h3>
              </div>
              <div style={{ padding: '0 0 10px 0' }}>
                <p style={{ color: '#888', marginBottom: '16px', fontSize: '14px' }}>
                  Sign out of your account on this device.
                </p>
                <button
                    onClick={handleLogout}
                    className="btn"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #f44336',
                      color: '#f44336',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
  );
};

export default Settings;