import React, { useState, useEffect } from 'react';
import { Search, Clock, CheckSquare, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardAPI, DashboardStats, tasksAPI, Task } from '../services/api';
import Calendar from '../components/Calendar';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Project Overview');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const stats = await dashboardAPI.getStats();
        setDashboardStats(stats);
        
        // Fetch recent tasks
        const tasks = await tasksAPI.getMyTasks();
        setRecentTasks(tasks.slice(0, 5)); // Show only 5 most recent tasks
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  // Sample data for charts
  const projectProgressData = [
    { day: 'Sun', progress: 200 },
    { day: 'Mon', progress: 400 },
    { day: 'Tue', progress: 900 },
    { day: 'Wed', progress: 600 },
    { day: 'Thu', progress: 500 },
    { day: 'Fri', progress: 950 },
    { day: 'Sat', progress: 300 }
  ];

  const tasksData = [
    { name: 'Project 1', progress: 78, icon: '✓' },
    { name: 'Project 2', progress: 78, icon: '⚡' },
    { name: 'Project 3', progress: 78, icon: '🔄' }
  ];

  const metricsData = [
    { 
      label: 'Task Done', 
      value: dashboardStats ? `${dashboardStats.taskCompletionRate}%` : '75%', 
      icon: <CheckSquare size={24} />, 
      color: '#ff6b9d' 
    },
    { 
      label: 'Minutes Online', 
      value: dashboardStats ? dashboardStats.minutesOnline.toString() : '234', 
      icon: <Clock size={24} />, 
      color: '#4a9eff' 
    },
    { 
      label: 'In Progress', 
      value: dashboardStats ? dashboardStats.inProgressTasks.toString() : '43', 
      icon: <TrendingUp size={24} />, 
      color: '#4caf50' 
    }
  ];

  const teamMembers = [
    { name: 'John Ekeler', project: 'Food Dashboard Design', timeToday: 'Today', timeWeek: 'This Week' },
    { name: 'Rubik Sans', project: 'Project Name', timeToday: 'Today', timeWeek: 'This Week' }
  ];

  const calendarEvents = [
    { time: '8:00 AM - 8:30 AM', title: 'Netflix Meetup', icon: 'N', color: '#f44336' },
    { time: '9:00 AM - 9:30 AM', title: 'Terk Client Call', icon: 'T', color: '#4a9eff' }
  ];

  const renderProjectOverview = () => {
    return (
      <div className="dashboard-content">
        {/* Left Column */}
        <div className="left-column">
          {/* Project Progress Widget */}
          <div className="widget">
            <div className="widget-header">
              <h3>Project Progress</h3>
              <select className="widget-select">
                <option>Weekly</option>
              </select>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={projectProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="day" stroke="#888" />
                  <YAxis stroke="#888" domain={[0, 1000]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#2a2a3e', 
                      border: '1px solid #444',
                      borderRadius: '8px',
                      color: '#fff'
                    }} 
                  />
                  <Bar dataKey="progress" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tasks Status Widget */}
          <div className="widget">
            <div className="widget-header">
              <h3>Tasks Status</h3>
              <select className="widget-select">
                <option>Today</option>
              </select>
            </div>
            <div className="tasks-list">
              {tasksData.map((task, index) => (
                <div key={index} className="task-item">
                  <div className="task-icon">{task.icon}</div>
                  <div className="task-info">
                    <div className="task-name">{task.name}</div>
                    <div className="task-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{task.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="middle-column">
          {/* Metrics Cards */}
          <div className="metrics-grid">
            {metricsData.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-icon" style={{ color: metric.color }}>
                  {metric.icon}
                </div>
                <div className="metric-content">
                  <div className="metric-value">{metric.value}</div>
                  <div className="metric-label">{metric.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Team Members Widget */}
          <div className="widget">
            <div className="widget-header">
              <h3>Members</h3>
            </div>
            <div className="members-list">
              {teamMembers.map((member, index) => (
                <div key={index} className="member-item">
                  <div className="member-info">
                    <div className="member-name">{member.name}</div>
                    <div className="member-project">{member.project}</div>
                  </div>
                  <div className="member-time">
                    <div className="time-item">
                      <span className="time-label">Today</span>
                      <span className="time-value">{member.timeToday}</span>
                    </div>
                    <div className="time-item">
                      <span className="time-label">This Week</span>
                      <span className="time-value">{member.timeWeek}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Calendar Widget */}
          <Calendar />

          {/* Task Line Widget */}
          <div className="widget">
            <div className="widget-header">
              <h3>Task Line</h3>
              <span className="task-date">28 Nov 2022</span>
            </div>
            <div className="timeline">
              {calendarEvents.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-time">{event.time}</div>
                  <div className="timeline-content">
                    <div 
                      className="timeline-icon" 
                      style={{ backgroundColor: event.color }}
                    >
                      {event.icon}
                    </div>
                    <div className="timeline-title">{event.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTaskManagement = () => {
    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getPriorityColor = (priority: string) => {
      switch (priority.toUpperCase()) {
        case 'HIGH': return '#f44336';
        case 'MEDIUM': return '#ff9800';
        case 'LOW': return '#4caf50';
        default: return '#999';
      }
    };

    return (
      <div className="dashboard-content">
        <div className="left-column" style={{ gridColumn: '1 / -1' }}>
          <div className="widget">
            <div className="widget-header">
              <h3>Recent Tasks</h3>
              <button 
                className="view-all-btn"
                onClick={() => navigate('/tasks')}
              >
                View All <ArrowRight size={16} />
              </button>
            </div>
            {recentTasks.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                No tasks assigned yet
              </div>
            ) : (
              <div className="tasks-list">
                {recentTasks.map((task) => (
                  <div key={task.id} className="task-item">
                    <div className="task-icon" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                      {task.priority.charAt(0)}
                    </div>
                    <div className="task-info">
                      <div className="task-name">{task.taskName}</div>
                      <div className="task-meta">
                        <span>Due: {formatDate(task.dueDate)}</span>
                        <span className="task-status-badge" style={{ 
                          backgroundColor: task.status === 'COMPLETED' ? '#4caf50' : '#2196f3' 
                        }}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderNotifications = () => {
    const notifications = [
      { title: 'New task assigned', message: 'You have been assigned to Project 1', time: '2 hours ago', type: 'info' },
      { title: 'Task completed', message: 'John Ekeler completed Design UI Components', time: '4 hours ago', type: 'success' },
      { title: 'Deadline approaching', message: 'Project 2 deadline is in 2 days', time: '1 day ago', type: 'warning' }
    ];

    return (
      <div className="dashboard-content">
        <div className="left-column" style={{ gridColumn: '1 / -1' }}>
          <div className="widget">
            <div className="widget-header">
              <h3>Notifications & Alerts</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {notifications.map((notif, index) => (
                <div key={index} style={{
                  padding: '16px',
                  backgroundColor: 'var(--primary-bg)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--white)' }}>{notif.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>{notif.time}</div>
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--gray-medium)' }}>{notif.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProjectTools = () => {
    const tools = [
      { name: 'Time Tracker', description: 'Track time spent on tasks', icon: '⏱️' },
      { name: 'Report Generator', description: 'Generate project reports', icon: '📊' },
      { name: 'Team Chat', description: 'Collaborate with team members', icon: '💬' },
      { name: 'File Manager', description: 'Manage project files', icon: '📁' }
    ];

    return (
      <div className="dashboard-content">
        <div className="left-column" style={{ gridColumn: '1 / -1' }}>
          <div className="widget">
            <div className="widget-header">
              <h3>Project Tools</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
              {tools.map((tool, index) => (
                <div key={index} style={{
                  padding: '24px',
                  backgroundColor: 'var(--primary-bg)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }} className="tool-card">
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>{tool.icon}</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--white)', marginBottom: '4px' }}>{tool.name}</div>
                  <div style={{ fontSize: '14px', color: 'var(--gray-medium)' }}>{tool.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Hi User! Welcome! Manage your all tasks & daily work here.</h1>
            <div className="user-score">
              Your Score <span className="score-badge">{dashboardStats?.score || 'A+'}</span>
            </div>
          </div>
          <div className="user-avatar">
            <div className="avatar-emoji">✌️</div>
            <div className="confetti">🎉</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <div className="tab-container">
            <button 
              className={`tab ${activeTab === 'Project Overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('Project Overview')}
            >
              Project Overview
            </button>
            <button 
              className={`tab ${activeTab === 'Task Management' ? 'active' : ''}`}
              onClick={() => setActiveTab('Task Management')}
            >
              Task Management
            </button>
            <button 
              className={`tab ${activeTab === 'Notifications & Alerts' ? 'active' : ''}`}
              onClick={() => setActiveTab('Notifications & Alerts')}
            >
              Notifications & Alerts
            </button>
            <button 
              className={`tab ${activeTab === 'Project Tools' ? 'active' : ''}`}
              onClick={() => setActiveTab('Project Tools')}
            >
              Project Tools
            </button>
          </div>
          <div className="search-icon">
            <Search size={20} />
          </div>
        </div>

        {/* Render content based on active tab */}
        {activeTab === 'Project Overview' && renderProjectOverview()}
        {activeTab === 'Task Management' && renderTaskManagement()}
        {activeTab === 'Notifications & Alerts' && renderNotifications()}
        {activeTab === 'Project Tools' && renderProjectTools()}
      </div>
    </div>
  );
};

export default Dashboard;
