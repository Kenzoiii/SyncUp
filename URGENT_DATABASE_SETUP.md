# 🚨 URGENT: Database Setup Required

## The Problem
The backend server is failing to start because the MySQL database `syncup_db` doesn't exist yet.

**Error**: `Unknown database 'syncup_db'`

## ✅ Solution: Set Up Database in MySQL Workbench

### Step 1: Open MySQL Workbench
1. Open **MySQL Workbench** (which you mentioned is running in the background)
2. Connect to your MySQL server with:
   - **Username**: `root`
   - **Password**: `admin123!@#`

### Step 2: Create Database and Tables
1. In MySQL Workbench, open the file `mysql-workbench-setup.sql` (I created this for you)
2. **Execute the entire script** (Ctrl+Shift+Enter or click the lightning bolt icon)
3. This will create:
   - Database `syncup_db`
   - All required tables
   - Test admin user

### Step 3: Verify Database Creation
After running the script, you should see:
- Database `syncup_db` in your schema list
- All tables created successfully
- Success message: "Database setup completed successfully!"

### Step 4: Test Admin User
- **Email**: `admin@syncup.com`
- **Password**: `password123`

## 🚀 After Database Setup

Once the database is created, run the backend server:

```bash
cd backend
java -jar target/syncup-backend-0.0.1-SNAPSHOT.jar
```

The backend should then start successfully and connect to your MySQL database!

## 📋 What the Script Does

The `mysql-workbench-setup.sql` script will:
1. Create the `syncup_db` database
2. Create all required tables (users, teams, projects, tasks, etc.)
3. Insert a test admin user with hashed password
4. Insert sample data for testing

**This is the missing piece that's causing the login error!**
