@echo off
echo Starting SyncUp Application...

echo.
echo [1/2] Starting Backend Server...
start "SyncUp Backend" cmd /k "cd /d D:\School Files\Coding\SyncUp\backend && java -jar target\syncup-backend-0.0.1-SNAPSHOT.jar"

echo.
echo [2/2] Starting Frontend Server...
start "SyncUp Frontend" cmd /k "cd /d D:\School Files\Coding\SyncUp\frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause
