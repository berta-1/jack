@echo off
title Facebook Fetcher Pro
echo ===================================================
echo Starting Facebook Fetcher Pro...
echo ===================================================
cd /d "%~dp0"
start http://localhost:3000
node server.js
pause
