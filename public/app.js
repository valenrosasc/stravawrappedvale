// Estado de la aplicación
let currentSlide = 0;
let totalSlides = 10;
let accessToken = null;
let athleteData = null;
let activitiesData = null;
let stats = {};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Verificar si venimos del redirect de Strava
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
        // Limpiar la URL para evitar reusar el código
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Tenemos código de autorización, intercambiarlo por token
        showScreen('loading-screen');
        exchangeToken(code);
    } else {
        // Mostrar pantalla de login
        showScreen('login-screen');
        setupLoginButton();
    }
    
    // Configurar navegación
    setupNavigation();
}

function setupLoginButton() {
    const loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', () => {
        // Redirigir a Strava para autorización
        window.location.href = CONFIG.AUTH_URL;
    });
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Intercambiar código por token de acceso
async function exchangeToken(code) {
    try {
        // Llamada al backend para intercambiar el código por token
        // El backend protege el CLIENT_SECRET
        const response = await fetch('/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            console.error('Error details from server:', data);
            alert('Error de Strava: ' + (data.details || data.error || 'Error desconocido') + '\n\nDetalles: ' + JSON.stringify(data.strava_error || {}));
            throw new Error(data.details || data.error || 'Error al obtener token');
        }
        accessToken = data.access_token;
        
        // Obtener datos del atleta y actividades
        await loadStravaData();
        
    } catch (error) {
        console.error('Error en autenticación:', error);
        alert('Error al conectar con Strava. Por favor, intenta de nuevo.');
        showScreen('login-screen');
    }
}

// Cargar datos de Strava
async function loadStravaData() {
    try {
        // Obtener información del atleta
        athleteData = await fetchStravaAPI('/athlete');
        
        // Obtener actividades del año
        const startDate = new Date(`${CONFIG.YEAR}-01-01`).getTime() / 1000;
        const endDate = new Date(`${CONFIG.YEAR}-12-31`).getTime() / 1000;
        
        activitiesData = await fetchAllActivities(startDate, endDate);
        
        // Calcular estadísticas
        calculateStats();
        
        // Mostrar wrapped
        displayWrapped();
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        alert('Error al cargar tus datos de Strava. Por favor, intenta de nuevo.');
        showScreen('login-screen');
    }
}

// Hacer llamadas a la API de Strava
async function fetchStravaAPI(endpoint) {
    const response = await fetch(`${CONFIG.API_BASE}${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    
    if (!response.ok) {
        throw new Error(`Error en API: ${response.status}`);
    }
    
    return await response.json();
}

// Obtener todas las actividades (paginadas)
async function fetchAllActivities(after, before) {
    let allActivities = [];
    let page = 1;
    const perPage = 200;
    
    while (true) {
        const activities = await fetchStravaAPI(
            `/athlete/activities?after=${after}&before=${before}&page=${page}&per_page=${perPage}`
        );
        
        if (activities.length === 0) break;
        
        allActivities = allActivities.concat(activities);
        
        if (activities.length < perPage) break;
        page++;
    }
    
    return allActivities;
}

// Calcular estadísticas
function calculateStats() {
    stats = {
        totalActivities: activitiesData.length,
        totalDistance: 0,
        totalTime: 0,
        totalElevation: 0,
        longestActivity: { distance: 0 },
        activeDays: new Set(),
        sportCount: {},
        monthCount: {}
    };
    
    activitiesData.forEach(activity => {
        // Distancia total (convertir a km)
        stats.totalDistance += activity.distance / 1000;
        
        // Tiempo total (en horas)
        stats.totalTime += activity.moving_time / 3600;
        
        // Elevación total
        stats.totalElevation += activity.total_elevation_gain || 0;
        
        // Actividad más larga
        if (activity.distance > stats.longestActivity.distance) {
            stats.longestActivity = activity;
        }
        
        // Días activos
        const activityDate = new Date(activity.start_date).toDateString();
        stats.activeDays.add(activityDate);
        
        // Contar por deporte
        const sportType = activity.sport_type || activity.type;
        stats.sportCount[sportType] = (stats.sportCount[sportType] || 0) + 1;
        
        // Contar por mes
        const month = new Date(activity.start_date).getMonth();
        stats.monthCount[month] = (stats.monthCount[month] || 0) + 1;
    });
    
    // Deporte favorito
    stats.favoriteSport = Object.entries(stats.sportCount)
        .sort((a, b) => b[1] - a[1])[0];
    
    // Mes más activo
    const bestMonthEntry = Object.entries(stats.monthCount)
        .sort((a, b) => b[1] - a[1])[0];
    
    if (bestMonthEntry) {
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        stats.bestMonth = {
            name: monthNames[parseInt(bestMonthEntry[0])],
            count: bestMonthEntry[1]
        };
    }
}

// Mostrar el wrapped
function displayWrapped() {
    showScreen('wrapped-screen');
    
    // Rellenar datos
    document.getElementById('athlete-name').textContent = athleteData.firstname + ' ' + athleteData.lastname;
    document.getElementById('total-activities').textContent = stats.totalActivities.toLocaleString();
    document.getElementById('total-distance').textContent = stats.totalDistance.toFixed(1).toLocaleString();
    document.getElementById('total-time').textContent = stats.totalTime.toFixed(0).toLocaleString();
    document.getElementById('total-elevation').textContent = stats.totalElevation.toFixed(0).toLocaleString();
    
    // Actividad más larga
    document.getElementById('longest-activity').textContent = (stats.longestActivity.distance / 1000).toFixed(1);
    document.getElementById('longest-activity-type').textContent = 
        `km - ${stats.longestActivity.sport_type || stats.longestActivity.type}`;
    document.getElementById('longest-activity-date').textContent = 
        new Date(stats.longestActivity.start_date).toLocaleDateString('es-ES', { 
            year: 'numeric', month: 'long', day: 'numeric' 
        });
    
    // Días activos
    document.getElementById('active-days').textContent = stats.activeDays.size;
    
    // Deporte favorito
    const sportEmojis = {
        'Run': '🏃‍♂️',
        'Ride': '🚴‍♂️',
        'Swim': '🏊‍♂️',
        'Walk': '🚶‍♂️',
        'Hike': '🥾',
        'AlpineSki': '⛷️',
        'NordicSki': '⛷️',
        'Workout': '💪',
        'Yoga': '🧘‍♂️'
    };
    
    if (stats.favoriteSport) {
        const [sportType, count] = stats.favoriteSport;
        document.getElementById('favorite-sport').textContent = sportEmojis[sportType] || '🏃‍♂️';
        document.getElementById('favorite-sport-name').textContent = sportType;
        document.getElementById('favorite-sport-count').textContent = `${count} actividades`;
    }
    
    // Mes más activo
    if (stats.bestMonth) {
        document.getElementById('best-month').textContent = stats.bestMonth.name;
        document.getElementById('best-month-count').textContent = `${stats.bestMonth.count} actividades`;
    }
    
    // Resumen final
    let summary = `¡Increíble! Completaste ${stats.totalActivities} actividades`;
    if (stats.totalDistance > 1000) {
        summary += ` y recorriste más de ${Math.floor(stats.totalDistance / 1000)} mil kilómetros`;
    }
    summary += ` en ${CONFIG.YEAR}. ¡Sigue así!`;
    document.getElementById('final-summary').textContent = summary;
    
    // Crear dots de navegación
    createDots();
}

// Configurar navegación entre slides
function setupNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shareBtn = document.getElementById('share-btn');
    const restartBtn = document.getElementById('restart-btn');
    
    prevBtn.addEventListener('click', () => changeSlide(-1));
    nextBtn.addEventListener('click', () => changeSlide(1));
    
    shareBtn.addEventListener('click', shareWrapped);
    restartBtn.addEventListener('click', () => changeSlide(-currentSlide));
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') changeSlide(-1);
        if (e.key === 'ArrowRight') changeSlide(1);
    });
    
    // Navegación táctil (swipe)
    let touchStartX = 0;
    let touchEndX = 0;
    
    const slideContainer = document.querySelector('.slide-container');
    
    slideContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slideContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchStartX - touchEndX > 50) changeSlide(1);
        if (touchEndX - touchStartX > 50) changeSlide(-1);
    }
}

function changeSlide(direction) {
    const newSlide = currentSlide + direction;
    
    if (newSlide < 0 || newSlide >= totalSlides) return;
    
    // Ocultar slide actual
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');
    
    // Mostrar nuevo slide
    currentSlide = newSlide;
    slides[currentSlide].classList.add('active');
    
    // Actualizar dots
    updateDots();
    
    // Actualizar botones
    document.getElementById('prev-btn').disabled = currentSlide === 0;
    document.getElementById('next-btn').disabled = currentSlide === totalSlides - 1;
}

function createDots() {
    const dotsContainer = document.getElementById('dots-container');
    dotsContainer.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => jumpToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function jumpToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');
    
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    
    updateDots();
    document.getElementById('prev-btn').disabled = currentSlide === 0;
    document.getElementById('next-btn').disabled = currentSlide === totalSlides - 1;
}

function shareWrapped() {
    // Crear texto para compartir
    const shareText = `Mi año en Strava ${CONFIG.YEAR}:
    
🏃 ${stats.totalActivities} actividades
📍 ${stats.totalDistance.toFixed(0)} km recorridos
⏱️ ${stats.totalTime.toFixed(0)} horas activo
${stats.favoriteSport ? `❤️ Deporte favorito: ${stats.favoriteSport[0]}` : ''}

#StravaWrapped #Strava`;
    
    // Intentar usar Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'Mi Strava Wrapped',
            text: shareText
        }).catch(err => console.log('Error al compartir:', err));
    } else {
        // Copiar al portapapeles
        navigator.clipboard.writeText(shareText).then(() => {
            alert('¡Texto copiado al portapapeles!');
        }).catch(() => {
            alert(shareText);
        });
    }
}
