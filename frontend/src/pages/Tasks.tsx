import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import CreateTaskModal from '../components/CreateTaskModal';
import { Plus } from 'lucide-react';
import { projectsAPI } from '../services/api';
import '../styles/Dashboard.css';

const Tasks: React.FC = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    // 1. Add this "Refresh Trigger" state
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const determineAdmin = async () => {
            try {
                const userString = localStorage.getItem('user');
                const user = userString ? JSON.parse(userString) : null;
                const teamId = user?.teamId;
                if (!teamId) { setIsAdmin(false); return; }
                const { teamsAPI } = await import('../services/api');
                const { role } = await teamsAPI.getMyRole(teamId);
                setIsAdmin(role === 'ADMIN');
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

                        {/* 2. Add the key={refreshTrigger} prop here.
                When 'refreshTrigger' changes, React destroys and recreates this component,
                forcing it to fetch the new data from the database. */}
                        <TaskList key={refreshTrigger} />

                    </div>
                </div>
            </div>

            {showCreateModal && (
                <CreateTaskModal
                    onClose={() => setShowCreateModal(false)}
                    // 3. When a task is created, increase the trigger by 1
                    onTaskCreated={() => setRefreshTrigger(prev => prev + 1)}
                />
            )}
        </div>
    );
};

export default Tasks;