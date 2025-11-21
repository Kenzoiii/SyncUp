import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, Users, Folder, Settings, CheckSquare } from 'lucide-react';
import '../styles/Dashboard.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const hideOnAuth = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  if (hideOnAuth) return null;

  return (
    <div className="sidebar">
      <div className="sidebar-icon"><BarChart3 size={24} /></div>
      <div className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
        <NavLink to="/projects" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>Projects</NavLink>
        <NavLink to="/tasks" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>Tasks</NavLink>
        <NavLink to="/members" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>Members</NavLink>
        <NavLink to="/settings" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>Settings</NavLink>
      </div>
      <div className="sidebar-logo">SyncUp</div>
    </div>
  );
};

export default Sidebar;


