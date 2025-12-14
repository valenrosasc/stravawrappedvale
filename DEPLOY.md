# 🚀 Guía de Despliegue - Strava Wrapped

Esta guía te llevará paso a paso para publicar tu Strava Wrapped en internet.

## 📋 Requisitos Previos

- [ ] Cuenta de GitHub (para subir tu código)
- [ ] Cuenta en un servicio de hosting (Vercel/Render/Railway)
- [ ] Tu código listo en tu computadora

---

## 🌐 PASO 1: Subir tu código a GitHub

### 1.1 Crear repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Click en el botón "+" arriba a la derecha → "New repository"
3. Configura:
   - **Repository name**: `strava-wrapped`
   - **Description**: "Mi resumen anual de Strava tipo Wrapped"
   - **Public** o **Private** (tu elección)
   - NO inicialices con README (ya tienes uno)
4. Click "Create repository"

### 1.2 Subir tu código

Abre tu terminal en la carpeta del proyecto y ejecuta:

```bash
# Inicializar Git (si no lo has hecho)
git init

# Añadir todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - Strava Wrapped"

# Conectar con GitHub (reemplaza USERNAME y REPO)
git remote add origin https://github.com/USERNAME/strava-wrapped.git

# Subir el código
git branch -M main
git push -u origin main
```

---

## 🚀 PASO 2: Desplegar en Vercel (Recomendado)

### 2.1 Crear cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Usa "Continue with GitHub" para vincular tu cuenta

### 2.2 Importar tu proyecto

1. En el dashboard de Vercel, click "Add New..." → "Project"
2. Busca tu repositorio `strava-wrapped`
3. Click "Import"

### 2.3 Configurar el proyecto

En la pantalla de configuración:

- **Framework Preset**: Déjalo en "Other"
- **Root Directory**: `./`
- **Build Command**: `npm install`
- **Output Directory**: Déjalo vacío
- **Install Command**: `npm install`

### 2.4 Añadir variables de entorno

⚠️ **NO LAS AÑADAS TODAVÍA** - Primero necesitas crear la app en Strava (siguiente paso)

Por ahora, solo click en "Deploy" para obtener tu URL.

### 2.5 Obtener tu URL

Una vez desplegado, verás tu URL, algo como:
```
https://strava-wrapped.vercel.app
```

**GUARDA ESTA URL** - la necesitarás para configurar Strava.

---

## 🏃 PASO 3: Crear tu App en Strava

### 3.1 Acceder a la configuración de API

1. Inicia sesión en [strava.com](https://strava.com)
2. Ve a [strava.com/settings/api](https://www.strava.com/settings/api)
3. Scroll hasta abajo hasta "My API Application"

### 3.2 Crear la aplicación

Click en "Create an App" y completa el formulario:

**Información de la Aplicación:**
```
Application Name: Mi Strava Wrapped 2025
Category: Visualizer
Club: (déjalo vacío)
Website: https://strava-wrapped.vercel.app
           ↑ TU URL DE VERCEL AQUÍ
           
Application Description: 
Genera un resumen visual tipo "Wrapped" con mis datos 
de Strava del año, mostrando estadísticas como distancia 
total, actividades completadas, días activos y más.
```

**Configuración de Autorización:**
```
Authorization Callback Domain: strava-wrapped.vercel.app
                               ↑ SOLO EL DOMINIO, SIN https://
```

**Icono de la Aplicación:**
- Opcional, puedes subir una imagen cuadrada (512x512px)

### 3.3 Aceptar términos

- ✅ Lee y acepta los términos de la API de Strava
- Click "Create"

### 3.4 Guardar tus credenciales

Verás tu aplicación creada con:

```
Client ID: 123456
Client Secret: abc123def456ghi789...
```

⚠️ **MUY IMPORTANTE:**
- **Copia estos valores AHORA**
- Guárdalos en un lugar seguro
- NUNCA los compartas públicamente
- El Client Secret solo se muestra una vez

---

## ⚙️ PASO 4: Configurar Variables de Entorno

### 4.1 En Vercel

1. Ve a tu proyecto en Vercel
2. Click en "Settings" (arriba)
3. Click en "Environment Variables" (menú izquierdo)
4. Añade estas 2 variables:

**Variable 1:**
```
Name: STRAVA_CLIENT_ID
Value: 123456  ← Tu Client ID de Strava
Environment: Production, Preview, Development (selecciona todas)
```

**Variable 2:**
```
Name: STRAVA_CLIENT_SECRET
Value: abc123def456...  ← Tu Client Secret de Strava
Environment: Production, Preview, Development (selecciona todas)
```

5. Click "Save" en cada una

### 4.2 Re-desplegar

1. Ve a "Deployments" (arriba)
2. Click en los "..." del último despliegue
3. Click "Redeploy"
4. Confirma "Redeploy"

Esto aplicará las variables de entorno.

---

## 🔧 PASO 5: Actualizar la Configuración

### 5.1 Actualizar config.js

En tu código local, abre `public/config.js` y actualiza:

```javascript
const CONFIG = {
    CLIENT_ID: '123456',  // ← TU CLIENT ID AQUÍ
    REDIRECT_URI: 'https://strava-wrapped.vercel.app',  // ← TU URL AQUÍ
    SCOPE: 'read,activity:read_all',
    API_BASE: 'https://www.strava.com/api/v3',
    YEAR: 2025
};
```

### 5.2 Subir los cambios

```bash
git add public/config.js
git commit -m "Actualizar configuración para producción"
git push
```

Vercel automáticamente detectará el cambio y re-desplegará.

---

## ✅ PASO 6: ¡Probar tu App!

1. Ve a tu URL: `https://strava-wrapped.vercel.app`
2. Click en "Conectar con Strava"
3. Autoriza la aplicación en Strava
4. ¡Disfruta tu Wrapped! 🎉

---

## 🔍 Verificación Final

Asegúrate de que:

- ✅ Tu app está desplegada en Vercel
- ✅ La app de Strava está creada
- ✅ El Authorization Callback Domain coincide con tu URL
- ✅ Las variables de entorno están configuradas en Vercel
- ✅ El CLIENT_ID en config.js coincide con Strava
- ✅ La REDIRECT_URI en config.js coincide con tu URL de Vercel

---

## 🐛 Solución de Problemas

### Error: "Redirect URI mismatch"
- Verifica que el dominio en Strava sea exactamente: `tu-app.vercel.app` (sin https://)
- Verifica que REDIRECT_URI en config.js sea: `https://tu-app.vercel.app` (con https://)

### Error: "Invalid client"
- Verifica que CLIENT_ID en config.js coincida con el de Strava
- Verifica que las variables de entorno estén en Vercel
- Re-despliega después de añadir variables

### La página se queda en "Analizando actividades..."
- Abre la consola del navegador (F12)
- Revisa si hay errores de red
- Verifica que el CLIENT_SECRET esté configurado en Vercel

### Error 500 al intercambiar token
- Verifica que las variables de entorno estén correctas
- Asegúrate de haber re-desplegado después de añadirlas

---

## 🎉 ¡Listo!

Tu Strava Wrapped ahora está público y cualquiera con el link puede usarlo para ver su propio resumen.

## 📱 Compartir

Puedes compartir tu URL con:
- Amigos que usan Strava
- En redes sociales
- En grupos de ciclismo/running

Cada persona verá SUS PROPIOS DATOS cuando se conecte con su cuenta de Strava.

---

## 🔐 Seguridad

Tu app es segura porque:
- ✅ El Client Secret está oculto en el servidor
- ✅ Solo tú puedes acceder a las variables de entorno
- ✅ Los usuarios solo autorizan acceso de lectura
- ✅ No se almacenan datos de usuarios
- ✅ Los tokens son temporales

---

## 📊 Monitoreo

En Vercel puedes ver:
- Número de visitas
- Logs del servidor
- Errores en tiempo real
- Uso de recursos

---

¿Necesitas ayuda? Revisa los logs en Vercel → tu proyecto → "Logs"
