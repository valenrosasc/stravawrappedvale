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
    const rawClientId = process.env.STRAVA_CLIENT_ID || '';
    const rawClientSecret = process.env.STRAVA_CLIENT_SECRET || '';
    const clientId = rawClientId.replace(/[\r\n]/g, '').trim() || '190207';
    const clientSecret = rawClientSecret.replace(/[\r\n]/g, '').trim() || 'caa32f7b2dc53a69d0d622af3dc0fb3ed3c2881d';
    
    console.log('=== TOKEN EXCHANGE REQUEST ===');
    console.log('Authorization code received:', code);
    console.log('Code length:', code?.length);
    console.log('client_id:', clientId);
    console.log('client_id_length:', clientId?.length);
    console.log('client_secret_length:', clientSecret?.length);
    console.log('client_secret (first 10 chars):', clientSecret?.substring(0, 10));
    console.log('client_secret (last 10 chars):', clientSecret?.substring(clientSecret.length - 10));
    
    if (!code) {
        return res.status(400).json({ error: 'Código no proporcionado' });
    }
    
    if (!clientId || !clientSecret) {
        console.error('ERROR: Variables de entorno no configuradas');
        return res.status(500).json({ error: 'Variables de entorno no configuradas' });
    }
    
    try {
        console.log('Sending request to Strava with:');
        console.log('- client_id:', clientId);
        console.log('- code:', code);
        console.log('- grant_type: authorization_code');
        
        const response = await axios.post('https://www.strava.com/oauth/token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: 'authorization_code'
        });
        
        console.log('✅ SUCCESS! Token received from Strava');
        
        res.json({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_at: response.data.expires_at
        });
    } catch (error) {
        console.error('❌ ERROR from Strava API:');
        console.error('Status:', error.response?.status);
        console.error('Response data:', JSON.stringify(error.response?.data, null, 2));
        console.error('Error message:', error.message);
        
        res.status(500).json({ 
            error: 'Error al obtener token de acceso',
            details: error.response?.data?.message || error.message,
            strava_error: error.response?.data
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📝 Asegúrate de tener configuradas las variables de entorno en .env`);
});
