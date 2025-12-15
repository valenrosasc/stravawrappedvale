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
        client_secret_exists: !!process.env.STRAVA_CLIENT_SECRET,
        client_secret_length: process.env.STRAVA_CLIENT_SECRET?.length || 0,
        node_env: process.env.NODE_ENV,
        all_env_keys: Object.keys(process.env).filter(k => k.startsWith('STRAVA'))
    });
});

// Endpoint para intercambiar el código por un token
app.post('/api/token', async (req, res) => {
    const { code } = req.body;
    
    console.log('=== TOKEN EXCHANGE REQUEST ===');
    console.log('Code received:', code ? 'YES' : 'NO');
    console.log('STRAVA_CLIENT_ID:', process.env.STRAVA_CLIENT_ID ? 'SET' : 'NOT SET');
    console.log('STRAVA_CLIENT_SECRET:', process.env.STRAVA_CLIENT_SECRET ? 'SET' : 'NOT SET');
    
    if (!code) {
        return res.status(400).json({ error: 'Código no proporcionado' });
    }
    
    if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET) {
        console.error('ERROR: Variables de entorno no configuradas');
        return res.status(500).json({ error: 'Variables de entorno no configuradas' });
    }
    
    try {
        const response = await axios.post('https://www.strava.com/oauth/token', {
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
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
