import React from 'react';
import TaskList from '../components/TaskList';
import '../styles/Dashboard.css';

const Tasks: React.FC = () => {
  return (
    <div className="dashboard">
      <div className="main-content">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Tasks</h1>
            <div className="user-score">Manage your assigned tasks</div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="left-column" style={{ gridColumn: '1 / -1' }}>
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;

