import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { tasksAPI, Task } from '../services/api';
import '../styles/TaskList.css';

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksAPI.getMyTasks();
      setTasks(data);
      setError(null);
    } catch (err: any) {
      setError('Failed to load tasks');
      console.error('Error fetching tasks:', err);
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
      case 'HIGH':
        return '#f44336';
      case 'MEDIUM':
        return '#ff9800';
      case 'LOW':
        return '#4caf50';
      default:
        return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return <CheckCircle size={20} color="#4caf50" />;
      case 'IN_PROGRESS':
        return <Clock size={20} color="#2196f3" />;
      case 'TODO':
        return <AlertCircle size={20} color="#ff9800" />;
      default:
        return <AlertCircle size={20} color="#999" />;
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    if (status.toUpperCase() === 'COMPLETED') return false;
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') {
      return task.status.toUpperCase() === 'COMPLETED';
    } else if (filter === 'pending') {
      return task.status.toUpperCase() !== 'COMPLETED';
    }
    return true;
  });

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
            Pending ({tasks.filter(t => t.status.toUpperCase() !== 'COMPLETED').length})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({tasks.filter(t => t.status.toUpperCase() === 'COMPLETED').length})
          </button>
        </div>
      </div>

      {loading && <div className="loading-message">Loading tasks...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && filteredTasks.length === 0 && (
        <div className="no-tasks-message">
          {filter === 'all' && 'No tasks assigned to you yet'}
          {filter === 'pending' && 'No pending tasks'}
          {filter === 'completed' && 'No completed tasks'}
        </div>
      )}

      <div className="tasks-grid">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`task-card ${isOverdue(task.dueDate, task.status) ? 'overdue' : ''}`}
          >
            <div className="task-card-header">
              <div className="task-status-icon">
                {getStatusIcon(task.status)}
              </div>
              <span
                className="task-priority"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                {task.priority}
              </span>
            </div>

            <h3 className="task-title">{task.taskName}</h3>
            <p className="task-description">{task.description || 'No description'}</p>

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
        ))}
      </div>
    </div>
  );
};

export default TaskList;

