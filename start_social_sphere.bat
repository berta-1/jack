@echo off
title Sphere Fullstack Launcher
echo ========================================================
echo   Launching Sphere Social Network + Backend Server
echo   - Backend Server running on http://localhost:5000
echo   - Frontend App opening on http://localhost:5173
echo ========================================================

start "Sphere Backend Server (Port 5000)" cmd /k "cd /d "%~dp0social-violet\server" && npm run dev"
timeout /t 2 /nobreak >nul
cd /d "%~dp0social-violet"
call npm run dev -- --open
pause
