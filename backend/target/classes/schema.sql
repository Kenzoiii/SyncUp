-- SyncUp Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS syncup_db;
USE syncup_db;

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Teams table
CREATE TABLE teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    description TEXT,
    admin_user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Team members table
CREATE TABLE team_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role ENUM('ADMIN', 'MEMBER') DEFAULT 'MEMBER',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_team_member (team_id, user_id)
);

-- Projects table
CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    team_id BIGINT NOT NULL,
    status ENUM('ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED') DEFAULT 'ACTIVE',
    progress_percentage INT DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Tasks table
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    project_id BIGINT NOT NULL,
    assigned_user_id BIGINT,
    status ENUM('TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'TODO',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
    start_date DATE,
    due_date DATE,
    completion_percentage INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Time logs table
CREATE TABLE time_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    task_id BIGINT NOT NULL,
    date DATE NOT NULL,
    time_spent_minutes INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('TASK_ASSIGNED', 'TASK_DUE', 'PROJECT_UPDATE', 'TEAM_INVITE', 'GENERAL') DEFAULT 'GENERAL',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Calendar events table
CREATE TABLE calendar_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    event_type ENUM('MEETING', 'CALL', 'TASK', 'PERSONAL', 'OTHER') DEFAULT 'OTHER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User scores table for gamification
CREATE TABLE user_scores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    score INT DEFAULT 0,
    level VARCHAR(50) DEFAULT 'A+',
    tasks_completed INT DEFAULT 0,
    minutes_online INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_score (user_id)
);

-- Insert sample data
INSERT INTO users (email, password, full_name) VALUES 
('admin@syncup.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Admin User'),
('john@syncup.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'John Ekeler'),
('rubik@syncup.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Rubik Sans');

INSERT INTO teams (team_name, description, admin_user_id) VALUES 
('Development Team', 'Main development team for SyncUp platform', 1),
('Design Team', 'UI/UX design team', 1);

INSERT INTO team_members (team_id, user_id, role) VALUES 
(1, 1, 'ADMIN'),
(1, 2, 'MEMBER'),
(1, 3, 'MEMBER'),
(2, 1, 'ADMIN'),
(2, 3, 'MEMBER');

INSERT INTO projects (project_name, description, team_id, status, progress_percentage) VALUES 
('Food Dashboard Design', 'Design and implement food ordering dashboard', 2, 'ACTIVE', 78),
('Project Name', 'Main project development', 1, 'ACTIVE', 78),
('SyncUp Platform', 'Core platform development', 1, 'ACTIVE', 65);

INSERT INTO tasks (task_name, description, project_id, assigned_user_id, status, priority, start_date, due_date, completion_percentage) VALUES 
('Design UI Components', 'Create reusable UI components', 1, 3, 'IN_PROGRESS', 'HIGH', '2025-10-15', '2025-11-15', 78),
('Implement Authentication', 'Build user authentication system', 2, 2, 'IN_PROGRESS', 'URGENT', '2025-10-10', '2025-11-01', 78),
('Database Schema Design', 'Design and implement database structure', 3, 1, 'COMPLETED', 'MEDIUM', '2025-09-20', '2025-10-20', 100),
('Frontend Development', 'Build React frontend components', 3, 2, 'IN_PROGRESS', 'HIGH', '2025-10-20', '2025-11-30', 45),
('API Integration', 'Integrate frontend with backend APIs', 3, 3, 'TODO', 'MEDIUM', '2025-11-01', '2025-12-01', 0);

INSERT INTO user_scores (user_id, score, level, tasks_completed, minutes_online) VALUES 
(1, 95, 'A+', 15, 234),
(2, 88, 'A', 12, 198),
(3, 92, 'A+', 14, 221);

INSERT INTO calendar_events (user_id, title, description, start_time, end_time, event_type) VALUES 
(1, 'Netflix Meetup', 'Team meeting with Netflix team', '2022-11-28 08:00:00', '2022-11-28 08:30:00', 'MEETING'),
(1, 'Terk Client Call', 'Client call with Terk company', '2022-11-28 09:00:00', '2022-11-28 09:30:00', 'CALL');
