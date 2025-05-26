@echo off
echo Iniciando Docker y Backend...

cd backend
start cmd /k "docker compose up -d && npm run start:dev"

cd ../frontend
echo Iniciando Frontend...
start cmd /k "npm run dev"

timeout /t 3 >nul
start http://localhost:5173

cd ..