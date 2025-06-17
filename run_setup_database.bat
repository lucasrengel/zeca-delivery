@echo off
echo Running database setup script...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p12345 < setup_database.sql
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to run the database setup script. Please ensure MySQL is installed and the path to mysql.exe is correct.
    echo You can run the script manually using: mysql -u root -p < setup_database.sql
    pause
) else (
    echo Database setup completed successfully.
    pause
)
