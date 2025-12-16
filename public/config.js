// Configuración de la aplicación Strava
// IMPORTANTE: Debes crear una aplicación en https://www.strava.com/settings/api
// y reemplazar estos valores con los tuyos

const CONFIG = {
    // ID de tu aplicación de Strava
    // Obténlo en: https://www.strava.com/settings/api
    CLIENT_ID: '190207',
    
    // URL de redirección (debe coincidir con la configurada en Strava)
    // Para producción, usa tu URL de Vercel/Render/Railway
    // Ejemplo: 'https://tu-app.vercel.app'
    // Para desarrollo local: 'http://localhost:3000'
    REDIRECT_URI: window.location.origin,
    
    // Alcances solicitados (permisos)
    SCOPE: 'read,activity:read_all',
    
    // URL base de la API de Strava
    API_BASE: 'https://www.strava.com/api/v3',
    
    // Año a analizar
    YEAR: 2025
};
// No modificar estas URLs
CONFIG.AUTH_URL = `https://www.strava.com/oauth/authorize?client_id=${CONFIG.CLIENT_ID}&response_type=code&redirect_uri=${CONFIG.REDIRECT_URI}&approval_prompt=force&scope=${CONFIG.SCOPE}`;
CONFIG.TOKEN_URL = 'https://www.strava.com/oauth/token';
