@echo off
echo ========================================
echo   Food Shooping - Servidor local
echo ========================================
echo.

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado.
    echo Descargalo desde https://nodejs.org
    echo.
    pause
    exit /b 1
)

if not exist node_modules (
    echo Instalando dependencias...
    call npm install
)

if not exist data\usuarios.xlsx (
    echo Creando base de datos Excel...
    call npm run init-db
)

echo.
echo Iniciando servidor en http://localhost:3000
echo Presiona Ctrl+C para detener
echo.
call npm start
