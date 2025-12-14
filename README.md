# 🏃‍♂️ Strava Wrapped 

Una aplicación web que genera un resumen visual tipo "Wrapped" con tus datos de Strava del año, similar al Spotify Wrapped.

![Strava Wrapped](https://img.shields.io/badge/Strava-FC4C02?style=for-the-badge&logo=strava&logoColor=white)

## ✨ Características

- 🔐 Autenticación OAuth con Strava
- 📊 10 slides con estadísticas del año:
  - Total de actividades y distancia
  - Tiempo en movimiento y elevación
  - Actividad más larga
  - Días activos y mes más activo
  - Deporte favorito
- 🎨 Interfaz tipo "Wrapped" con animaciones suaves
- 📱 Diseño responsive (móvil y escritorio)
- 🎯 Navegación con botones, teclado y gestos táctiles
- 🔗 Opción para compartir resultados

---

## 🚀 Inicio Rápido

### Opción 1: Desplegar en Internet (Recomendado)

**👉 Lee la guía paso a paso en [DEPLOY.md](DEPLOY.md)**

Esta guía te llevará de cero a tener tu app pública en internet con Vercel (totalmente gratis).

**¿Por qué desplegar primero?**
- Strava requiere una URL pública para crear la aplicación
- Es más fácil configurar todo desde el inicio
- Podrás compartir tu app con amigos

### Opción 2: Desarrollo Local

Si solo quieres probar localmente, sigue estos pasos:

#### 1. Instalar dependencias

```bash
npm install
```

#### 2. Configurar variables de entorno

```bash
# Copia el archivo de ejemplo
copy .env.example .env
```

Edita `.env` con tus credenciales de Strava (ver siguiente paso).

#### 3. Crear App en Strava

⚠️ **Nota**: Para desarrollo local, Strava requiere que uses `localhost` como dominio autorizado.

1. Ve a [strava.com/settings/api](https://www.strava.com/settings/api)
2. Click "Create an App"
3. Completa:
   - **Application Name**: Mi Strava Wrapped Local
   - **Website**: `http://localhost:3000`
   - **Authorization Callback Domain**: `localhost`
4. Guarda tu **Client ID** y **Client Secret**

#### 4. Configurar la app

Edita `public/config.js` y pon tu Client ID:

```javascript
CLIENT_ID: '123456',  // Tu Client ID aquí
```

Edita `.env` con tus credenciales:

```
STRAVA_CLIENT_ID=123456
STRAVA_CLIENT_SECRET=tu_secret_aqui
```

#### 5. Ejecutar

```bash
npm start
```

O usa el script rápido: `start.bat` (Windows) o `./start.sh` (Mac/Linux)

Abre: `http://localhost:3000`

---

## 📖 Uso

1. Abre la aplicación en tu navegador
2. Click en "Conectar con Strava"
3. Autoriza la aplicación en Strava
4. Espera mientras se analizan tus actividades
5. ¡Navega por tu Wrapped! Usa:
   - Botones ← →
   - Flechas del teclado
   - Swipe en móvil
   - Los puntos para saltar entre slides

---

## 🎨 Personalización

### Cambiar el año analizado

En `public/config.js`:
```javascript
YEAR: 2024  // Cambia al año que quieras
```

### Modificar colores

En `public/styles.css`:
```css
background: linear-gradient(135deg, #fc4c02 0%, #ff6b35 50%, #fc4c02 100%);
```

Cambia `#fc4c02` por el color que prefieras.

### Añadir nuevas estadísticas

1. Añade un slide en `public/index.html` (copia uno existente)
2. Calcula tu estadística en `calculateStats()` en `public/app.js`
3. Muéstrala en `displayWrapped()`
4. Actualiza `totalSlides` en `app.js`

---

## 🔧 Estructura del Proyecto

```
strava-wrapped/
├── public/                 # Frontend
│   ├── index.html         # Estructura y slides
│   ├── styles.css         # Estilos y animaciones
│   ├── app.js             # Lógica del cliente
│   └── config.js          # Configuración de API
├── server.js              # Backend (Node.js/Express)
├── package.json           # Dependencias
├── .env.example           # Template de variables
├── vercel.json            # Config para Vercel
├── Procfile               # Config para Heroku
├── start.bat / start.sh   # Scripts de inicio
├── DEPLOY.md              # Guía de despliegue
└── README.md              # Este archivo
```

---

## 🐛 Solución de Problemas

### Error: "Redirect URI mismatch"

**Causa**: La URL de redirección no coincide con la configurada en Strava.

**Solución**:
- Verifica que en Strava el dominio sea exactamente igual
- Para local: `localhost` (sin http://)
- Para producción: `tu-app.vercel.app` (sin https://)

### Error: "Invalid client" o 401

**Causa**: Client ID o Client Secret incorrectos.

**Solución**:
- Verifica que `CLIENT_ID` en `config.js` sea correcto
- En producción, verifica las variables de entorno en tu hosting
- Re-despliega después de cambiar variables de entorno

### No aparecen actividades

**Causa**: No hay datos o error al cargar.

**Solución**:
1. Abre la consola del navegador (F12 → Console)
2. Busca errores en rojo
3. Verifica que tengas actividades en el año configurado
4. Confirma que diste permisos de lectura

### Se queda en "Analizando actividades..."

**Causa**: Error al obtener el token o al llamar la API.

**Solución**:
- Revisa la consola del navegador
- Verifica que el Client Secret esté configurado
- En local: revisa tu archivo `.env`
- En producción: revisa las variables de entorno

### Error de CORS

**Causa**: Intentando hacer requests desde el frontend directamente.

**Solución**:
- Usa el servidor backend incluido (`server.js`)
- No uses `python -m http.server` o similares
- Usa `npm start` que inicia el servidor Express

---

## 📝 Notas de Seguridad

✅ **Tu app es segura porque:**
- El Client Secret está en el backend, no expuesto
- Solo solicita permisos de lectura
- No almacena datos de usuarios
- Los tokens son temporales
- El código es de código abierto (puedes auditarlo)

⚠️ **Buenas prácticas:**
- Nunca subas tu archivo `.env` a GitHub (está en `.gitignore`)
- No compartas tu Client Secret públicamente
- Usa variables de entorno en producción
- Mantén tus dependencias actualizadas

---

## 🚀 Características Técnicas

- **Frontend**: HTML5, CSS3, JavaScript vanilla (sin frameworks)
- **Backend**: Node.js + Express
- **API**: Strava API v3 con OAuth 2.0
- **Hosting**: Vercel, Render, Railway compatible
- **Responsive**: Mobile-first design
- **Performance**: Carga rápida, sin librerías pesadas

---

## 🎯 Roadmap

Funciones planeadas para futuras versiones:

- [ ] Comparación entre años
- [ ] Gráficos interactivos (Chart.js)
- [ ] Exportar como imagen (canvas)
- [ ] Compartir en redes sociales
- [ ] Modo oscuro
- [ ] Traducción a múltiples idiomas
- [ ] Logros y badges personalizados
- [ ] Predicciones para el próximo año
- [ ] Comparación con amigos

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y disponible bajo la licencia MIT.

---

## ⚠️ Disclaimer

Esta aplicación no está afiliada, asociada, autorizada, respaldada por, o de ninguna manera oficialmente conectada con Strava, Inc. 

"Strava" y las marcas relacionadas son marcas registradas de Strava, Inc.

---

## 🙏 Créditos

Inspirado en Spotify Wrapped y creado para la comunidad de atletas de Strava.

---

## 📞 Soporte

¿Problemas o preguntas?

1. Revisa la sección de [Solución de Problemas](#-solución-de-problemas)
2. Lee [DEPLOY.md](DEPLOY.md) para dudas sobre despliegue
3. Abre un Issue en GitHub

---

Hecho con ❤️ para la comunidad de Strava
