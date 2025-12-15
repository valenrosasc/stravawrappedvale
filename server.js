const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para intercambiar el código por un token
app.post('/api/token', async (req, res) => {
    const { code } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Código no proporcionado' });
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
