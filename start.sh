#!/bin/bash

echo "🏃 Strava Wrapped - Setup Rápido"
echo ""

# Verificar si existe .env
if [ ! -f .env ]; then
    echo "⚠️  No se encontró archivo .env"
    echo "📝 Creando .env desde .env.example..."
    cp .env.example .env
    echo ""
    echo "✅ Archivo .env creado"
    echo ""
    echo "⚙️  Por favor, edita el archivo .env con tus credenciales de Strava:"
    echo "   1. Ve a https://www.strava.com/settings/api"
    echo "   2. Copia tu Client ID y Client Secret"
    echo "   3. Pégalos en el archivo .env"
    echo ""
    echo "Luego ejecuta este script de nuevo."
    exit 1
fi

echo "✅ Archivo .env encontrado"
echo ""

# Verificar si existen node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    echo ""
fi

echo "🚀 Iniciando servidor..."
echo ""
echo "📍 Tu app estará disponible en: http://localhost:3000"
echo "🌐 Para desplegar en producción, consulta DEPLOY.md"
echo ""

npm start
