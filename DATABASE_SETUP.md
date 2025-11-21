# SyncUp Database Setup Instructions

## 🗄️ MySQL Database Setup

### Step 1: Run Database Setup Script
1. Open **MySQL Workbench**
2. Connect to your MySQL server with:
   - **Username**: `root`
   - **Password**: `admin123!@#`
3. Open the file `database-setup.sql` in MySQL Workbench
4. Execute the entire script (Ctrl+Shift+Enter)

### Step 2: Verify Database Creation
After running the script, you should see:
- Database `syncup_db` created
- All tables created successfully
- Test admin user inserted

### Step 3: Test Admin User Credentials
- **Email**: `admin@syncup.com`
- **Password**: `password123`

## 🚀 Starting the Application

### Backend Server
```bash
cd backend
java -jar target/syncup-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Server
```bash
cd frontend
npm start
```

## 📊 Database Schema

The database includes the following tables:
- `users` - User accounts and authentication
- `teams` - Team management
- `team_members` - Team membership and roles
- `projects` - Project tracking
- `tasks` - Task management
- `time_logs` - Time tracking
- `notifications` - User notifications
- `calendar_events` - Calendar integration
- `user_scores` - Gamification scores

## 🔧 Configuration

The backend is configured to connect to:
- **Host**: `localhost:3306`
- **Database**: `syncup_db`
- **Username**: `root`
- **Password**: `admin123!@#`

## ✅ Verification

Once the database is set up and both servers are running:
1. Visit `http://localhost:3000`
2. Click "Sign in"
3. Use the test admin credentials to login
4. You should see the dashboard with sample data
