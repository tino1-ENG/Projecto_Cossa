# MozBid Platform - Windows PowerShell Startup Script
Write-Host "==========================================================" -ForegroundColor DarkYellow
Write-Host "       MOZBID -- PREMIUM ONLINE AUCTION MARKETPLACE       " -ForegroundColor Yellow
Write-Host "             Mercado de Leiloes em Mocambique             " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor DarkYellow

Write-Host "`n[1/3] A verificar dependencias e base de dados SQLite e MongoDB..." -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\backend"
node src/database/seed.js
node src/database/seed-mongo.js

Write-Host "`n[2/3] A iniciar Servidor Backend (Node.js + Express + Socket.IO + SQLite)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; Write-Host '--- MOZBID BACKEND (Port 5000) ---' -ForegroundColor Yellow; node src/index.js"

Start-Sleep -Seconds 2

Write-Host "`n[3/3] A iniciar Interface Frontend (Vue 3 + Quasar + Vite + TypeScript)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; Write-Host '--- MOZBID FRONTEND QUASAR (Port 5173) ---' -ForegroundColor Yellow; npx vite"

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "   MozBid inicializado com sucesso!" -ForegroundColor Green
Write-Host "   Frontend Quasar: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend Node API: http://localhost:5000/api/health" -ForegroundColor White
Write-Host "   Base de Dados: backend\data\mozbid.db (SQLite WAL)" -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Green
