@echo off
title Sphere Fullstack Launcher
echo ========================================================
echo   Launching Sphere Social Network + Backend Server
echo   - Backend Server running on http://localhost:5000
echo   - Frontend App opening on http://localhost:5173
echo ========================================================

start "Sphere Backend Server (Port 5000)" cmd /k "cd /d "%~dp0server" && npm run dev"
timeout /t 2 /nobreak >nul
cd /d "%~dp0"
call npm run dev -- --open
pause
