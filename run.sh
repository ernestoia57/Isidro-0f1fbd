#!/bin/bash

echo "🛢️ Iniciando Docker PostgreSQL..."
cd backend
docker compose up -d

echo "🚀 Iniciando Backend NestJS..."
npm run start:dev &
sleep 3

echo "🌐 Iniciando Frontend Vite..."
cd ../frontend
npm run dev &
sleep 2

echo "🌍 Abriendo navegador en http://localhost:5173"
powershell.exe start http://localhost:5173
