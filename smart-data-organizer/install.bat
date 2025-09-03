@echo off
echo Installing Smart Data Organizer dependencies...

echo.
echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Creating environment file...
cd ..\backend
if not exist .env (
    copy .env.example .env
    echo Created .env file from template
)

cd ..
echo.
echo Installation completed successfully!
echo.
echo To start the development servers:
echo npm run dev
echo.
pause
