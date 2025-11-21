@echo off
echo Setting up SyncUp MySQL Database...
echo.

echo Connecting to MySQL with credentials:
echo Username: root
echo Password: admin123!@#
echo.

echo Please make sure MySQL Workbench is running and accessible.
echo.

echo Running database schema creation...
mysql -u root -padmin123!@# < backend/src/main/resources/schema.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ Database setup completed successfully!
    echo.
    echo Test Admin User Created:
    echo Email: admin@syncup.com
    echo Password: password123
    echo.
    echo You can now login with these credentials.
) else (
    echo.
    echo ❌ Database setup failed. Please check:
    echo 1. MySQL is running
    echo 2. Credentials are correct (root/admin123!@#)
    echo 3. MySQL Workbench is accessible
)

pause
