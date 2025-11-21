import React from 'react';
import '../styles/Dashboard.css';

const Members: React.FC = () => {
  const teamMembers = [
    { name: 'John Ekeler', project: 'Food Dashboard Design', timeToday: '8 hrs', timeWeek: '40 hrs' },
    { name: 'Rubik Sans', project: 'Project Name', timeToday: '6 hrs', timeWeek: '35 hrs' },
    { name: 'Jane Doe', project: 'Mobile App', timeToday: '7 hrs', timeWeek: '38 hrs' }
  ];

  return (
    <div className="dashboard">
      <div className="main-content">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Team Members</h1>
            <div className="user-score">Manage your team</div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="left-column" style={{ gridColumn: '1 / -1' }}>
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
        </div>
      </div>
    </div>
  );
};

export default Members;


