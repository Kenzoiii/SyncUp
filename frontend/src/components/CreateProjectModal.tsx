import React, { useState } from 'react';
import { X, Folder, Calendar } from 'lucide-react';
import { projectsAPI } from '../services/api';
import '../styles/CreateTaskModal.css'; // Re-use the modal styles we made earlier!

interface CreateProjectModalProps {
    onClose: () => void;
    onProjectCreated: () => void;
    teamId: number; // We need to know which team to create it for
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onProjectCreated, teamId }) => {
    const [formData, setFormData] = useState({
        projectName: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await projectsAPI.createProject({
                ...formData,
                teamId: teamId
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