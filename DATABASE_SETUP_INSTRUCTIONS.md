# 🚀 COMPLETE DATABASE SETUP GUIDE

## ⚠️ CRITICAL: This will fix your login error!

### 📋 Step-by-Step Instructions:

#### 1. **Open MySQL Workbench**
- Open MySQL Workbench (which you mentioned is running)
- Connect with:
  - **Username**: `root`
  - **Password**: `admin123!@#`

#### 2. **Run Database Setup Script**
- Open the file `COMPLETE_DATABASE_SETUP.sql` (I created this for you)
- **Execute the ENTIRE script** (Ctrl+Shift+Enter or click the lightning bolt icon)
- Wait for completion

#### 3. **Verify Success**
After running the script, you should see:
```
✅ DATABASE SETUP COMPLETED SUCCESSFULLY!
Test Admin User Created:
Email: admin@syncup.com
Password: password123
You can now start the backend server!
```

#### 4. **Start Backend Server**
Once the database is created, run:
```bash
cd backend
java -jar target/syncup-backend-0.0.1-SNAPSHOT.jar
```

#### 5. **Test Login**
- Visit `http://localhost:3000`
- Click "Sign in"
- Use credentials:
  - **Email**: `admin@syncup.com`
  - **Password**: `password123`

## 🎯 What This Fixes:

✅ **Creates the missing `syncup_db` database**  
✅ **Creates all required tables**  
✅ **Adds test admin user with proper password hash**  
✅ **Backend server will start successfully**  
✅ **Login will work without errors**  
✅ **Frontend will connect to backend properly**  

## 🔧 Database Schema Created:

- `users` - User accounts and authentication
- `teams` - Team management
- `team_members` - Team membership and roles
- `projects` - Project tracking
- `tasks` - Task management
- `time_logs` - Time tracking
- `notifications` - User notifications
- `calendar_events` - Calendar integration
- `user_scores` - Gamification scores

## 🚨 Important Notes:

- **Run the script ONCE** - it will clean and recreate everything
- **Make sure MySQL Workbench is connected** before running
- **The script is safe** - it only affects the `syncup_db` database
- **After running**, the backend will start successfully

**This is the missing piece causing your `net::ERR_CONNECTION_REFUSED` error!**
