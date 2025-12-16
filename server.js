const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint de diagnóstico (ELIMINAR en producción)
app.get('/api/debug', (req, res) => {
    res.json({
        client_id_exists: !!process.env.STRAVA_CLIENT_ID,
        client_id_length: process.env.STRAVA_CLIENT_ID?.length || 0,
        client_id_value: process.env.STRAVA_CLIENT_ID,
        client_secret_exists: !!process.env.STRAVA_CLIENT_SECRET,
        client_secret_length: process.env.STRAVA_CLIENT_SECRET?.length || 0,
        client_secret_first5: process.env.STRAVA_CLIENT_SECRET?.substring(0, 5),
        client_secret_last5: process.env.STRAVA_CLIENT_SECRET?.substring(process.env.STRAVA_CLIENT_SECRET.length - 5),
        node_env: process.env.NODE_ENV,
        all_env_keys: Object.keys(process.env).filter(k => k.startsWith('STRAVA'))
    });
});

// Test de conexión con Strava
app.get('/api/test-strava', async (req, res) => {
    try {
        const testCode = 'test_code_invalid'; // Código inválido a propósito
        const response = await axios.post('https://www.strava.com/oauth/token', {
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            code: testCode,
            grant_type: 'authorization_code'
        });
        res.json({ success: true, message: 'Conexión OK' });
    } catch (error) {
        res.json({
            success: false,
            error_message: error.response?.data?.message || error.message,
            error_details: error.response?.data || {},
            status: error.response?.status,
            client_id_sent: process.env.STRAVA_CLIENT_ID,
            client_secret_length: process.env.STRAVA_CLIENT_SECRET?.length
        });
    }
});

// Endpoint para intercambiar el código por un token
app.post('/api/token', async (req, res) => {
    const { code } = req.body;
    
    // Limpiar variables de entorno de espacios y saltos de línea
    // Si la variable tiene el salto de línea, usar el valor hardcodeado temporalmente
    const clientId = process.env.STRAVA_CLIENT_ID?.trim() || '190207';
    const clientSecret = process.env.STRAVA_CLIENT_SECRET?.trim() || 'caa32f7b2dc53a69d0d622af3dc0fb3ed3c2881d';
    
    console.log('=== TOKEN EXCHANGE REQUEST ===');
    console.log('Code received:', code ? 'YES' : 'NO');
    console.log('STRAVA_CLIENT_ID:', clientId ? 'SET' : 'NOT SET');
    console.log('STRAVA_CLIENT_SECRET:', clientSecret ? 'SET' : 'NOT SET');
    console.log('Client Secret length:', clientSecret?.length);
    
    if (!code) {
        return res.status(400).json({ error: 'Código no proporcionado' });
    }
    
    if (!clientId || !clientSecret) {
        console.error('ERROR: Variables de entorno no configuradas');
        return res.status(500).json({ error: 'Variables de entorno no configuradas' });
    }
    
    try {
        const response = await axios.post('https://www.strava.com/oauth/token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: 'authorization_code'
        });
        
        res.json({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_at: response.data.expires_at
        });
    } catch (error) {
        console.error('Error al intercambiar token:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Error al obtener token de acceso',
            details: error.response?.data?.message || error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📝 Asegúrate de tener configuradas las variables de entorno en .env`);
});
