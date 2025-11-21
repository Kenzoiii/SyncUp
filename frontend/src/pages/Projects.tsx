import React, { useState, useEffect } from 'react';
import { Plus, Users, Search, X } from 'lucide-react';
import { projectsAPI, Project, ProjectMember, UserSearchResult } from '../services/api';
import '../styles/Dashboard.css';
import '../styles/Projects.css';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addMemberError, setAddMemberError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectsAPI.getMyProjects();
      setProjects(data);
      setError(null);
    } catch (err: any) {
      setError('Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project);
    try {
      const members = await projectsAPI.getProjectMembers(project.id);
      setProjectMembers(members);
    } catch (err) {
      console.error('Error fetching project members:', err);
    }
  };

  const handleSearchUsers = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await projectsAPI.searchUsers(query);
      setSearchResults(results);
      setAddMemberError(null);
    } catch (err) {
      console.error('Error searching users:', err);
    }
  };

  const handleAddMember = async (user: UserSearchResult) => {
    if (!selectedProject) return;

    try {
      await projectsAPI.addMember(selectedProject.id, user.email);
      setAddMemberError(null);
      setShowAddMemberModal(false);
      setSearchQuery('');
      setSearchResults([]);
      // Refresh members list
      const members = await projectsAPI.getProjectMembers(selectedProject.id);
      setProjectMembers(members);
    } catch (err: any) {
      const errorMessage = err.response?.data || 'Failed to add member';
      setAddMemberError(errorMessage);
      console.error('Error adding member:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return '#4caf50';
      case 'PLANNING':
        return '#2196f3';
      case 'ON_HOLD':
        return '#ff9800';
      case 'COMPLETED':
        return '#9e9e9e';
      default:
        return '#6366f1';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return '🔄';
      case 'PLANNING':
        return '📋';
      case 'ON_HOLD':
        return '⏸️';
      case 'COMPLETED':
        return '✓';
      default:
        return '📌';
    }
  };

  return (
    <div className="dashboard">
      <div className="main-content">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Projects</h1>
            <div className="user-score">Overview of your projects</div>
          </div>
        </div>

        {loading && <div className="loading-message">Loading projects...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="projects-layout">
          {/* Projects List */}
          <div className="projects-list-section">
            <div className="widget">
              <div className="widget-header">
                <h3>All Projects</h3>
                <span className="project-count">{projects.length} projects</span>
              </div>
              <div className="projects-grid">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`project-card ${selectedProject?.id === project.id ? 'selected' : ''}`}
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="project-card-header">
                      <span className="project-icon">{getStatusIcon(project.status)}</span>
                      <span 
                        className="project-status"
                        style={{ backgroundColor: getStatusColor(project.status) }}
                      >
                        {project.status}
                      </span>
                    </div>
                    <h4 className="project-name">{project.projectName}</h4>
                    <p className="project-description">{project.description}</p>
                    <div className="project-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${project.progressPercentage}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{project.progressPercentage}%</span>
                    </div>
                    {project.isAdmin && (
                      <span className="admin-badge">Admin</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Details */}
          {selectedProject && (
            <div className="project-details-section">
              <div className="widget">
                <div className="widget-header">
                  <h3>
                    <Users size={20} />
                    Team Members
                  </h3>
                  {selectedProject.isAdmin && (
                    <button
                      className="add-member-btn"
                      onClick={() => setShowAddMemberModal(true)}
                    >
                      <Plus size={16} />
                      Add Member
                    </button>
                  )}
                </div>
                <div className="members-list">
                  {projectMembers.map((member) => (
                    <div key={member.userId} className="member-card">
                      <div className="member-avatar">
                        {member.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="member-info">
                        <div className="member-name">{member.fullName}</div>
                        <div className="member-email">{member.email}</div>
                      </div>
                      <span className={`member-role ${member.role.toLowerCase()}`}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Member Modal */}
        {showAddMemberModal && selectedProject && (
          <div className="modal-overlay" onClick={() => setShowAddMemberModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add Member to {selectedProject.projectName}</h3>
                <button
                  className="modal-close"
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setSearchQuery('');
                    setSearchResults([]);
                    setAddMemberError(null);
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="search-input-wrapper">
                  <Search size={18} />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => handleSearchUsers(e.target.value)}
                    autoFocus
                  />
                </div>
                {addMemberError && (
                  <div className="error-message">{addMemberError}</div>
                )}
                <div className="search-results">
                  {searchQuery.trim().length < 2 ? (
                    <div className="search-hint">Type at least 2 characters to search</div>
                  ) : searchResults.length === 0 ? (
                    <div className="no-results">No users found</div>
                  ) : (
                    searchResults.map((user) => (
                      <div
                        key={user.userId}
                        className="search-result-item"
                        onClick={() => handleAddMember(user)}
                      >
                        <div className="member-avatar">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="member-info">
                          <div className="member-name">{user.fullName}</div>
                          <div className="member-email">{user.email}</div>
                        </div>
                        <Plus size={18} className="add-icon" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
