import React, { useState, useEffect } from 'react';
import { X, Folder, Calendar, Users } from 'lucide-react';
import { projectsAPI, teamsAPI, Team } from '../services/api';
import '../styles/CreateTaskModal.css';

interface CreateProjectModalProps {
    onClose: () => void;
    onProjectCreated: () => void;
    defaultTeamId?: number; // Optional now, since we have a selector
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onProjectCreated, defaultTeamId }) => {
    const [formData, setFormData] = useState({
        projectName: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        teamId: defaultTeamId || ''
    });

    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch teams so user can select one
    useEffect(() => {
        const loadTeams = async () => {
            try {
                const myTeams = await teamsAPI.getMyTeams();
                setTeams(myTeams);
                // If no team selected yet, default to the first one or the passed default
                if (!formData.teamId && myTeams.length > 0) {
                    setFormData(prev => ({ ...prev, teamId: myTeams[0].id }));
                }
            } catch (err) {
                console.error("Failed to load teams");
            }
        };
        loadTeams();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await projectsAPI.createProject({
                ...formData,
                teamId: Number(formData.teamId)
            });
            onProjectCreated();
            onClose();
        } catch (err: any) {
            setError('Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%' }}>
                <div className="modal-header">
                    <h3>Create New Project</h3>
                    <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {error && <div className="error-message">{error}</div>}

                    {/* Team Selector - NEW FEATURE */}
                    <div className="form-group">
                        <label className="label-text"><Users size={16} /> Assign to Team</label>
                        <select
                            className="input"
                            value={formData.teamId}
                            onChange={e => setFormData({...formData, teamId: Number(e.target.value)})}
                            required
                        >
                            {teams.map(t => (
                                <option key={t.id} value={t.id}>{t.teamName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="label-text"><Folder size={16} /> Project Name</label>
                        <input
                            className="input"
                            value={formData.projectName}
                            onChange={e => setFormData({...formData, projectName: e.target.value})}
                            required
                            placeholder="e.g. Website Redesign"
                        />
                    </div>

                    <div className="form-group">
                        <label className="label-text">Description</label>
                        <textarea
                            className="input"
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            rows={3}
                            placeholder="What is this project about?"
                        />
                    </div>

                    <div className="form-group">
                        <label className="label-text"><Calendar size={16} /> Start Date</label>
                        <input
                            type="date"
                            className="input"
                            value={formData.startDate}
                            onChange={e => setFormData({...formData, startDate: e.target.value})}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Project'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;