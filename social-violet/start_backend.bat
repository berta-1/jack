@echo off
title Sphere Backend Server
echo ========================================================
echo   Starting Sphere Backend Server (Express + Prisma)
echo   Running on http://localhost:5000
echo ========================================================
cd /d "%~dp0\server"
call npm run dev
pause

