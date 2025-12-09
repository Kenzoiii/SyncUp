import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Flag, Briefcase } from 'lucide-react';
import { projectsAPI, tasksAPI, Project, ProjectMember } from '../services/api';
import '../styles/CreateTaskModal.css'; // We will create this small CSS file next

interface CreateTaskModalProps {
    onClose: () => void;
    onTaskCreated: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, onTaskCreated }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [formData, setFormData] = useState({
        taskName: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        assignedUserId: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // 1. Fetch Projects on load
    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await projectsAPI.getMyProjects();
                setProjects(data);
            } catch (err) {
                setError('Failed to load projects');
            }
        };
        loadProjects();
    }, []);

    // 2. Fetch Members when Project changes
    useEffect(() => {
        if (!selectedProjectId) {
            setMembers([]);
            return;
        }
        const loadMembers = async () => {
            try {
                const data = await projectsAPI.getProjectMembers(Number(selectedProjectId));
                setMembers(data);
            } catch (err) {
                console.error("Could not load members", err);
            }
        };
        loadMembers();
    }, [selectedProjectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProjectId) {
            setError("Please select a project.");
            return;
        }

        setLoading(true);
        try {
            await tasksAPI.createTask({
                ...formData,
                projectId: Number(selectedProjectId),
                assignedUserId: formData.assignedUserId ? Number(formData.assignedUserId) : undefined
            });
            onTaskCreated();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            {/* Used 'modal' class to match Dashboard.css */}
            <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '100%' }}>
                <div className="modal-header">
                    <h3>Create New Task</h3>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    {error && <div className="error-message" style={{marginBottom: '1rem'}}>{error}</div>}

                    {/* Project Selection */}
                    <div className="form-group">
                        <label className="label-text"><Briefcase size={16} /> Project</label>
                        <select
                            className="input"
                            value={selectedProjectId}
                            onChange={e => setSelectedProjectId(e.target.value)}
                            required
                        >
                            <option value="">Select a Project...</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.projectName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Task Name */}
                    <div className="form-group">
                        <label className="label-text">Task Name</label>
                        <input
                            className="input"
                            placeholder="e.g. Design Homepage"
                            value={formData.taskName}
                            onChange={e => setFormData({...formData, taskName: e.target.value})}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="label-text">Description</label>
                        <textarea
                            className="input"
                            placeholder="Details..."
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="label-text"><User size={16} /> Assign To</label>
                            <select
                                className="input"
                                value={formData.assignedUserId}
                                onChange={e => setFormData({...formData, assignedUserId: e.target.value})}
                                disabled={!selectedProjectId}
                            >
                                <option value="">Unassigned</option>
                                {members.map(m => (
                                    <option key={m.userId} value={m.userId}>{m.fullName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="label-text"><Flag size={16} /> Priority</label>
                            <select
                                className="input"
                                value={formData.priority}
                                onChange={e => setFormData({...formData, priority: e.target.value})}
                            >
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label-text"><Calendar size={16} /> Due Date</label>
                        <input
                            type="date"
                            className="input"
                            value={formData.dueDate}
                            onChange={e => setFormData({...formData, dueDate: e.target.value})}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Task'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;