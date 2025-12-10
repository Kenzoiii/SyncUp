import React, { useState, useEffect } from 'react';
import { X, Users, PlusCircle, CheckCircle, Trash2 } from 'lucide-react';
import { teamsAPI, Team } from '../services/api';
import '../styles/CreateTaskModal.css';

interface TeamModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const TeamModal: React.FC<TeamModalProps> = ({ onClose, onSuccess }) => {

    const [activeTab, setActiveTab] = useState<'create' | 'join' | 'my-teams'>('my-teams');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [myTeams, setMyTeams] = useState<Team[]>([]);

    // Form Data
    const [teamName, setTeamName] = useState('');

    // Current User Context
    const userString = localStorage.getItem('user');
    const currentUser = userString ? JSON.parse(userString) : null;

    const defaultDesc = currentUser ? `Team created by ${currentUser.fullName}. ` : '';
    const [description, setDescription] = useState(defaultDesc);

    useEffect(() => {
        if (activeTab === 'my-teams') loadMyTeams();
    }, [activeTab]);

    const loadMyTeams = async () => {
        try {
            const teams = await teamsAPI.getMyTeams();
            setMyTeams(teams);
        } catch (err) { console.error("Failed to load teams"); }
    };

    const handleSwitchTeam = (team: Team) => {
        if (!currentUser) return;
        localStorage.setItem('user', JSON.stringify({ ...currentUser, teamId: team.id, teamName: team.teamName }));
        onSuccess(); // Triggers page reload
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (activeTab === 'create') await teamsAPI.createTeam({ teamName, description });
            else if (activeTab === 'join') await teamsAPI.joinTeam(teamName);

            onSuccess();
            onClose();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Action failed.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTeam = async (teamId: number) => {
        if (!window.confirm("Are you sure? This will delete the team for everyone.")) return;

        try {
            await teamsAPI.deleteTeam(teamId);
            if (currentUser?.teamId === teamId) {
                const updatedUser = { ...currentUser, teamId: null, teamName: null };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            loadMyTeams();
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to delete team");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Team Management</h3>
                    <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', borderBottom: '1px solid #444' }}>
                    {['my-teams', 'create', 'join'].map(tab => (
                        <button key={tab} onClick={() => { setActiveTab(tab as any); setError(''); }}
                                style={{
                                    background: 'none', border: 'none', padding: '10px 5px',
                                    color: activeTab === tab ? '#4a9eff' : '#888',
                                    borderBottom: activeTab === tab ? '2px solid #4a9eff' : 'none',
                                    cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize'
                                }}
                        >
                            {tab.replace('-', ' ')}
                        </button>
                    ))}
                </div>

                {activeTab === 'my-teams' ? (
                    <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {myTeams.map(team => (
                            <div key={team.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'white' }}>{team.teamName}</div>
                                    <div style={{ fontSize: '12px', color: '#888' }}>{team.description || 'No description'}</div>
                                </div>

                                {/* --- BUTTON GROUP --- */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                                    {/* SWITCH BUTTON */}
                                    {currentUser?.teamId === team.id ? (
                                        <span style={{ color: '#4caf50', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <CheckCircle size={14}/> Active
                                        </span>
                                    ) : (
                                        <button onClick={() => handleSwitchTeam(team)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                                            Switch
                                        </button>
                                    )}

                                    {/* --- DELETE BUTTON (Added Back) --- */}
                                    {/* Only shows if you are the Admin */}
                                    {currentUser?.userId === team.adminUserId && (
                                        <button
                                            onClick={() => handleDeleteTeam(team.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#f44336',
                                                padding: '4px',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                            title="Delete Team"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                    {/* ---------------------------------- */}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="modal-form">
                        {error && <div style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', border: '1px solid #f44336', color: '#f44336', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>{error}</div>}

                        <div className="form-group">
                            <label className="label-text">{activeTab === 'create' ? <PlusCircle size={16}/> : <Users size={16}/>} Team Name</label>
                            <input className="input" value={teamName} onChange={e => setTeamName(e.target.value)} required />
                        </div>

                        {activeTab === 'create' && (
                            <div className="form-group"><label className="label-text">Description</label><textarea className="input" rows={3} value={description} onChange={e => setDescription(e.target.value)} /></div>
                        )}

                        <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>{loading ? 'Processing...' : activeTab === 'create' ? 'Create' : 'Join'}</button>
                    </form>
                )}
            </div>
        </div>
    );
};
export default TeamModal;