@echo off
cd /d "%~dp0"
echo Starting SKILLNEST immersive experience...
if not exist node_modules call npm install
call npm run dev
pause
