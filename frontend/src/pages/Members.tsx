import React, { useState, useEffect } from 'react';
import { User, Shield, Mail, Calendar, Trash2 } from 'lucide-react';
import { teamsAPI, TeamMember, Team } from '../services/api';
import '../styles/Projects.css'; // Re-using card styles

const Members: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teamName, setTeamName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleError, setRoleError] = useState<string>('');

  useEffect(() => {
    fetchMembers();
    determineAdmin();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // 1. Get Active Team from LocalStorage
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const activeTeamId = user?.teamId;
      setTeamName(user?.teamName || 'Your Team');

      if (!activeTeamId) {
        setError("No active team found. Please select a team in the Dashboard.");
        setLoading(false);
        return;
      }

      // 2. Fetch Data
      const data = await teamsAPI.getTeamMembers(activeTeamId);
      setMembers(data);
    } catch (err) {
      console.error("Failed to load members", err);
      setError("Failed to load team members.");
    } finally {
      setLoading(false);
    }
  };

  const determineAdmin = async () => {
    try {
      const userString = localStorage.getItem('user');
      const user = userString ? JSON.parse(userString) : null;
      const activeTeamId = user?.teamId;
      if (!activeTeamId) {
        setIsAdmin(false);
        return;
      }
      const members = await teamsAPI.getTeamMembers(activeTeamId);
      const me = members.find(m => m.userId === user?.userId);
      setIsAdmin(!!me && me.role === 'ADMIN');
    } catch (e) {
      setIsAdmin(false);
    }
  };

  const handleKick = async (member: TeamMember) => {
    if (!isAdmin) return;
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const activeTeamId = user?.teamId;
    if (!activeTeamId) return;

    if (member.role === 'ADMIN') {
      alert('Admins cant be kicked');
      return;
    }
    if (!window.confirm(`Remove ${member.fullName} from the team?`)) return;
    try {
      await teamsAPI.kickMember(activeTeamId, member.userId);
      fetchMembers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleRoleChange = async (member: TeamMember, newRole: 'ADMIN' | 'MEMBER') => {
    setRoleError('');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const activeTeamId = user?.teamId;
    if (!activeTeamId) return;
    try {
      await teamsAPI.updateMemberRole(activeTeamId, member.userId, newRole);
      fetchMembers();
    } catch (err: any) {
      setRoleError(err.response?.data?.message || 'Failed to update role');
    }
  };

  // Helper for initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
      <div className="dashboard">
        <div className="main-content">
          <div className="dashboard-header">
            <div className="welcome-section">
              <h1>Team Members</h1>
              <div className="user-score">People in <strong>{teamName}</strong></div>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="left-column" style={{ gridColumn: '1 / -1' }}>

              {loading && <div className="loading-message">Loading members...</div>}

              {error && (
                  <div className="error-message" style={{ textAlign: 'center', padding: '40px' }}>
                    {error}
                  </div>
              )}

              {!loading && !error && (
                  <div className="widget">
                    <div className="widget-header">
                      <h3>All Members ({members.length})</h3>
                    </div>

                    <div className="members-list">
                      {members.map((member) => (
                          <div key={member.userId} className="member-item" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: '20px' }}>
                            {/* Avatar */}
                            <div style={{
                              width: '45px', height: '45px',
                              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              borderRadius: '50%', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', color: 'white', fontWeight: 'bold'
                            }}>
                              {getInitials(member.fullName)}
                            </div>

                            {/* Info */}
                            <div>
                              <div style={{ fontWeight: '600', color: 'white', fontSize: '15px' }}>
                                {member.fullName}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '13px', marginTop: '4px' }}>
                                <Mail size={12} /> {member.email}
                              </div>
                              {isAdmin && member.userId !== JSON.parse(localStorage.getItem('user') || '{}').userId && (
                                <div style={{ marginTop: '8px' }}>
                                  <label style={{ fontSize: 12, color: '#9ca3af', marginRight: 8 }}>Role</label>
                                  <select
                                    value={member.role}
                                    onChange={(e) => handleRoleChange(member, e.target.value as 'ADMIN' | 'MEMBER')}
                                    className="role-select"
                                  >
                                    <option value="ADMIN" className="role-option admin">ADMIN</option>
                                    <option value="MEMBER" className="role-option member">MEMBER</option>
                                  </select>
                                  {roleError && (
                                    <div style={{ color: '#f44336', fontSize: 12, marginTop: 6 }}>{roleError}</div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Joined Date */}
                            <div className="member-time" style={{ textAlign: 'left' }}>
                              <span className="time-label"><Calendar size={10}/> Joined</span>
                              <span className="time-value">
                          {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}
                        </span>
                            </div>

                            {/* Role + Kick (aligned in one row, button to the right) */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                padding: '6px 12px', borderRadius: '20px',
                                background: member.role === 'ADMIN' ? 'rgba(255, 107, 157, 0.1)' : 'rgba(74, 158, 255, 0.1)',
                                color: member.role === 'ADMIN' ? '#ff6b9d' : '#4a9eff',
                                fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px'
                              }}>
                                {member.role === 'ADMIN' ? <Shield size={12}/> : <User size={12}/>}
                                {member.role}
                              </div>
                              {isAdmin && member.role !== 'ADMIN' && (
                                <button
                                  onClick={() => handleKick(member)}
                                  style={{ background: 'none', border: '1px solid #f44336', color: '#f44336', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}
                                  title="Remove Member"
                                >
                                  <Trash2 size={14} /> Kick
                                </button>
                              )}
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Members;