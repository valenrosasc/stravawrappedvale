# 📋 Checklist de Configuración - Strava Wrapped

Usa esta lista para verificar que todo esté configurado correctamente.

---

## ✅ PARTE 1: Preparar el Proyecto

- [ ] Código descargado/clonado en tu computadora
- [ ] Node.js instalado (verificar con `node --version`)
- [ ] Dependencias instaladas (`npm install`)

---

## ✅ PARTE 2: Subir a GitHub

- [ ] Cuenta de GitHub creada
- [ ] Repositorio nuevo creado en GitHub
- [ ] Código subido con Git:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/TU-USUARIO/strava-wrapped.git
  git push -u origin main
  ```

---

## ✅ PARTE 3: Desplegar en Vercel

- [ ] Cuenta en Vercel creada (vercel.com)
- [ ] Vercel conectado con GitHub
- [ ] Proyecto importado desde GitHub
- [ ] Primera build completada exitosamente
- [ ] URL obtenida (ej: `https://strava-wrapped.vercel.app`)

**Tu URL de Vercel:** _______________________________

---

## ✅ PARTE 4: Crear App en Strava

- [ ] Sesión iniciada en strava.com
- [ ] Navegado a strava.com/settings/api
- [ ] Formulario completado:
  - [ ] Application Name: `Mi Strava Wrapped 2025`
  - [ ] Category: `Visualizer`
  - [ ] Website: Tu URL de Vercel
  - [ ] Authorization Callback Domain: Tu dominio (sin https://)
- [ ] Términos aceptados
- [ ] App creada exitosamente

**Client ID:** _______________________________

**Client Secret:** _______________________________ (guárdalo en lugar seguro)

---

## ✅ PARTE 5: Configurar Variables de Entorno

### En Vercel:

- [ ] Navegado a Settings → Environment Variables
- [ ] Variable `STRAVA_CLIENT_ID` añadida
- [ ] Variable `STRAVA_CLIENT_SECRET` añadida
- [ ] Ambas variables configuradas para: Production, Preview, Development
- [ ] Variables guardadas

### Re-desplegar:

- [ ] Ir a Deployments
- [ ] Re-desplegar el último deployment
- [ ] Nueva build completada

---

## ✅ PARTE 6: Actualizar Config.js

- [ ] Archivo `public/config.js` abierto
- [ ] `CLIENT_ID` actualizado con tu Client ID de Strava
- [ ] Cambios guardados
- [ ] Cambios commiteados y pusheados a GitHub:
  ```bash
  git add public/config.js
  git commit -m "Configurar Client ID"
  git push
  ```
- [ ] Vercel detectó el cambio y re-desplegó

---

## ✅ PARTE 7: Probar la Aplicación

- [ ] Navegado a tu URL de Vercel
- [ ] Botón "Conectar con Strava" visible
- [ ] Click en el botón
- [ ] Redirigido a página de autorización de Strava
- [ ] Permisos aceptados
- [ ] Redirigido de vuelta a tu app
- [ ] Pantalla "Analizando actividades..." visible
- [ ] ¡Wrapped mostrado correctamente! 🎉

---

## 🐛 Si algo no funciona...

### Problema: Redirect URI mismatch

**Verifica:**
- [ ] En Strava, Authorization Callback Domain es: `tu-app.vercel.app` (sin https://)
- [ ] Tu URL funciona en el navegador
- [ ] No hay espacios extra en el dominio

### Problema: Invalid client

**Verifica:**
- [ ] Client ID en `config.js` es correcto
- [ ] Variables de entorno en Vercel están correctas
- [ ] Re-desplegaste después de añadir variables

### Problema: Se queda cargando

**Verifica:**
- [ ] Abre la consola del navegador (F12)
- [ ] Lee los errores
- [ ] Client Secret está en las variables de entorno de Vercel
- [ ] Tienes actividades en el año configurado (2025)

---

## 📱 Para Compartir

Una vez que todo funcione:

- [ ] Prueba la app en tu móvil
- [ ] Verifica que funcionen los gestos táctiles
- [ ] Comparte tu URL con amigos
- [ ] Opcional: Personaliza colores/textos

---

## 🎯 URLs Importantes

- **Tu App**: https://________________________________
- **GitHub Repo**: https://github.com/____________/strava-wrapped
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Strava API Settings**: https://www.strava.com/settings/api

---

## 📝 Notas Adicionales

Espacio para tus notas:

_______________________________________________________________

_______________________________________________________________

_______________________________________________________________

_______________________________________________________________

---

## ✨ ¡Listo!

Si todos los checkboxes están marcados, ¡tu Strava Wrapped está funcionando!

Comparte tu logro en redes: #StravaWrapped #Strava

---

**Fecha de configuración:** ____ / ____ / ________

**Tiempo total:** _______ minutos
