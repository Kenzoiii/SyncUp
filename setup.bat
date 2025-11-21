@echo off
echo ========================================
echo    SyncUp Application Setup Script
echo ========================================
echo.

echo [1/4] Setting up MySQL Database...
echo Please run the following SQL commands in MySQL Workbench:
echo.
echo 1. Create database:
echo    CREATE DATABASE IF NOT EXISTS syncup_db;
echo    USE syncup_db;
echo.
echo 2. Run the schema file:
echo    Source: backend/src/main/resources/schema.sql
echo.
echo Press any key after you've completed the database setup...
pause

echo.
echo [2/4] Starting Spring Boot Backend...
cd backend
echo Starting backend server on port 8080...
start "SyncUp Backend" cmd /k "mvn spring-boot:run"
cd ..

echo.
echo [3/4] Waiting for backend to start...
timeout /t 10 /nobreak

echo.
echo [4/4] Starting React Frontend...
cd frontend
echo Starting frontend server on port 3000...
start "SyncUp Frontend" cmd /k "npm start"
cd ..

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Default login credentials:
echo Email: admin@syncup.com
echo Password: admin123
echo.
echo Press any key to exit...
pause
