@echo off
echo.
echo 🏃 Strava Wrapped - Setup Rápido
echo.

REM Verificar si existe .env
if not exist .env (
    echo ⚠️  No se encontró archivo .env
    echo 📝 Creando .env desde .env.example...
    copy .env.example .env >nul
    echo.
    echo ✅ Archivo .env creado
    echo.
    echo ⚙️  Por favor, edita el archivo .env con tus credenciales de Strava:
    echo    1. Ve a https://www.strava.com/settings/api
    echo    2. Copia tu Client ID y Client Secret
    echo    3. Pégalos en el archivo .env
    echo.
    echo Luego ejecuta este script de nuevo.
    pause
    exit /b 1
)

echo ✅ Archivo .env encontrado
echo.

REM Verificar si existen node_modules
if not exist node_modules (
    echo 📦 Instalando dependencias...
    call npm install
    echo.
)

echo 🚀 Iniciando servidor...
echo.
echo 📍 Tu app estará disponible en: http://localhost:3000
echo 🌐 Para desplegar en producción, consulta DEPLOY.md
echo.

npm start
