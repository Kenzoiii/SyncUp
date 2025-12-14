import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, Trash2, User } from 'lucide-react';
import { tasksAPI, Task } from '../services/api';
import '../styles/TaskList.css';
import TaskDetailModal from './TaskDetailModal';

// 1. Accept isAdmin as a prop
interface TaskListProps {
    isAdmin: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ isAdmin }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);

            // Get Active Team ID
            const userString = localStorage.getItem('user');
            const user = userString ? JSON.parse(userString) : null;
            const activeTeamId = user?.teamId;

            // The backend now decides if it returns "All Tasks" (for Admin) or "My Tasks" (for Member)
            const data = await tasksAPI.getMyTasks(activeTeamId);

            setTasks(data);
            setError(null);
        } catch (err: any) {
            setError('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toUpperCase()) {
            case 'HIGH': return 'yellow';
            case 'MEDIUM': return 'blue';
            case 'LOW': return 'white';
            default: return 'red'; // Urgent
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toUpperCase()) {
            case 'COMPLETED': return <CheckCircle size={20} color="#4caf50" />;
            case 'IN_PROGRESS': return <Clock size={20} color="#2196f3" />;
            case 'TODO': return <AlertCircle size={20} color="#ff9800" />;
            default: return <AlertCircle size={20} color="#999" />;
        }
    };

    const isOverdue = (dueDate: string, status: string) => {
        if (status.toUpperCase() === 'COMPLETED') return false;
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    };

    const handleDeleteTask = async (taskId: number) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await tasksAPI.deleteTask(taskId);
            fetchTasks(); // Refresh list
        } catch (err) {
            console.error("Failed to delete task", err);
        }
    };

    // Helper to render the assignee info
    const renderAssignee = (task: Task) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#666', marginBottom: '8px' }}>
            <User size={14} />
            {task.assignedUserName ? (
                <span>Assigned to <strong style={{ color: 'black' }}>{task.assignedUserName}</strong></span>
            ) : (
                <span style={{ fontStyle: 'italic', color: '#999' }}>Unassigned</span>
            )}
        </div>
    );

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.status.toUpperCase() === 'COMPLETED';
        if (filter === 'pending') return task.status.toUpperCase() !== 'COMPLETED';
        return true;
    });

    const pendingTasks = tasks.filter(t => t.status.toUpperCase() !== 'COMPLETED');
    const completedTasks = tasks.filter(t => t.status.toUpperCase() === 'COMPLETED');

    // Reusable Card Component to avoid code duplication inside the return
    const TaskCard = ({ task }: { task: Task }) => (
        <div
            className={`task-card ${isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}
            onClick={() => setSelectedTask(task)}
            style={{ cursor: 'pointer', opacity: task.status === 'COMPLETED' ? 0.95 : 1 }}
        >
            <div className="task-card-header">
                <div className="task-status-icon">
                    {getStatusIcon(task.status)}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span
              className="task-priority"
              style={{ backgroundColor: getPriorityColor(task.priority) }}
          >
            {task.priority}
          </span>

                    {/* 2. ONLY SHOW DELETE IF ADMIN */}
                    {isAdmin && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0 }}
                            className="delete-task-btn"
                            title="Delete Task"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <h3 className="task-title">{task.taskName}</h3>
            <p className="task-description">{task.description || 'No description'}</p>

            {/* 3. SHOW ASSIGNEE NAME */}
            {renderAssignee(task)}

            <div className="task-dates">
                <div className="date-item">
                    <Calendar size={16} />
                    <div className="date-info">
                        <span className="date-label">Start Date</span>
                        <span className="date-value">{formatDate(task.startDate)}</span>
                    </div>
                </div>
                <div className="date-item">
                    <Clock size={16} />
                    <div className="date-info">
                        <span className="date-label">Deadline</span>
                        <span className={`date-value ${isOverdue(task.dueDate, task.status) ? 'overdue-text' : ''}`}>
              {formatDate(task.dueDate)}
            </span>
                    </div>
                </div>
            </div>

            <div className="task-footer">
        <span className="task-status-badge">
          {task.status.replace('_', ' ')}
        </span>
                {isOverdue(task.dueDate, task.status) && (
                    <span className="overdue-badge">Overdue</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="task-list-container">
            <div className="task-list-header">
                <h2>My Tasks</h2>
                <div className="task-filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({tasks.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending ({pendingTasks.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed ({completedTasks.length})
                    </button>
                </div>
            </div>

            {loading && <div className="loading-message">Loading tasks...</div>}
            {error && <div className="error-message">{error}</div>}

            {!loading && !error && filteredTasks.length === 0 && (
                <div className="no-tasks-message">
                    {filter === 'all' && 'No tasks found.'}
                    {filter === 'pending' && 'No pending tasks.'}
                    {filter === 'completed' && 'No completed tasks.'}
                </div>
            )}

            {/* RENDER LISTS */}
            {filter === 'all' ? (
                <>
                    {pendingTasks.length > 0 && (
                        <>
                            <h3 style={{ margin: '16px 0 8px', color: '#1a1a1a' }}>Pending</h3>
                            <div className="tasks-grid">
                                {pendingTasks.map((task) => <TaskCard key={task.id} task={task} />)}
                            </div>
                        </>
                    )}

                    {completedTasks.length > 0 && (
                        <>
                            <h3 style={{ margin: '24px 0 8px', color: '#1a1a1a' }}>Completed</h3>
                            <div className="tasks-grid">
                                {completedTasks.map((task) => <TaskCard key={task.id} task={task} />)}
                            </div>
                        </>
                    )}
                </>
            ) : (
                <div className="tasks-grid">
                    {filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)}
                </div>
            )}

            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdated={(updated) => {
                        // Optimistically update local state
                        setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
                        setSelectedTask(null);
                        fetchTasks(); // Refetch to be sure
                    }}
                />
            )}
        </div>
    );
};

export default TaskList;