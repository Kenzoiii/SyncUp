import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import CreateTaskModal from '../components/CreateTaskModal';
import { Plus } from 'lucide-react';
import '../styles/Dashboard.css';

const Tasks: React.FC = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const determineAdmin = async () => {
            try {
                const userString = localStorage.getItem('user');
                const user = userString ? JSON.parse(userString) : null;
                const teamId = user?.teamId;
                if (!teamId) { setIsAdmin(false); return; }
                const { teamsAPI } = await import('../services/api');
                const teamMembers = await teamsAPI.getTeamMembers(teamId);
                const me = teamMembers.find((m: any) => m.userId === user.userId);
                setIsAdmin(me?.role === 'ADMIN');
            } catch (e) {
                setIsAdmin(false);
            }
        };
        determineAdmin();
    }, []);

    return (
        <div className="dashboard">
            <div className="main-content">
                <div className="dashboard-header">
                    <div className="welcome-section">
                        <h1>Tasks</h1>
                        <div className="user-score">Manage your assigned tasks</div>
                    </div>

                    {isAdmin && (
                        <button
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={() => setShowCreateModal(true)}
                        >
                            <Plus size={18} /> New Task
                        </button>
                    )}
                </div>

                <div className="dashboard-content">
                    <div className="left-column" style={{ gridColumn: '1 / -1' }}>
                        {/* PASS isAdmin TO TASK LIST */}
                        <TaskList key={refreshTrigger} isAdmin={isAdmin} />
                    </div>
                </div>
            </div>

            {showCreateModal && (
                <CreateTaskModal
                    onClose={() => setShowCreateModal(false)}
                    onTaskCreated={() => setRefreshTrigger(prev => prev + 1)}
                />
            )}
        </div>
    );
};

export default Tasks;