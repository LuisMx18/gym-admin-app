# 🛠️ Comandos Útiles - GymAdmin

Guía rápida de comandos para trabajar con el proyecto.

---

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Limpiar caché si hay problemas
npm start -- --clear
```

---

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# Iniciar en Android directamente
npm run android

# Iniciar en iOS (requiere Mac)
npm run ios

# Iniciar en Web (para testing visual)
npm run web
```

---

## 📱 Testing con Expo Go

```bash
# 1. Instala Expo Go en tu teléfono
# Android: https://play.google.com/store/apps/details?id=host.exp.exponent
# iOS: https://apps.apple.com/app/expo-go/id982107779

# 2. Ejecuta
npm start

# 3. Escanea el QR code con:
# - Android: App de Expo Go
# - iOS: Cámara nativa del iPhone
```

---

## 🔧 Debugging

```bash
# Ver logs en tiempo real
npm start

# Después presiona:
# - j: Abrir Chrome DevTools
# - r: Recargar app
# - m: Toggle menu
# - d: Show developer menu

# Limpiar todo y empezar de cero
rm -rf node_modules
npm install
npm start -- --clear
```

---

## 🏗️ Build para Producción

### Android APK

```bash
# Instalar EAS CLI (una sola vez)
npm install -g eas-cli

# Login a tu cuenta Expo
eas login

# Configurar build
eas build:configure

# Crear APK para testing
eas build --platform android --profile preview

# Crear AAB para Play Store
eas build --platform android --profile production
```

### iOS (requiere Mac y cuenta de Apple Developer)

```bash
# Build para testing (TestFlight)
eas build --platform ios --profile preview

# Build para App Store
eas build --platform ios --profile production
```

---

## 🔥 Firebase

```bash
# Instalar Firebase CLI (opcional, para deploy de reglas)
npm install -g firebase-tools

# Login
firebase login

# Inicializar proyecto
firebase init

# Deploy de reglas de Firestore
firebase deploy --only firestore:rules
```

---

## 📊 Gestión de Dependencias

```bash
# Ver dependencias instaladas
npm list --depth=0

# Actualizar dependencias (con precaución)
npm update

# Verificar vulnerabilidades
npm audit

# Agregar nueva dependencia
npm install nombre-del-paquete

# Remover dependencia
npm uninstall nombre-del-paquete
```

---

## 🧹 Limpieza

```bash
# Limpiar caché de Expo
npm start -- --clear

# Limpiar node_modules
rm -rf node_modules
npm install

# Limpiar todo (node_modules + lock)
rm -rf node_modules package-lock.json
npm install

# Limpiar builds de Android
cd android
./gradlew clean
cd ..
```

---

## 🔍 Inspección

```bash
# Ver estructura del proyecto
tree -L 3 -I 'node_modules'

# Ver tamaño de node_modules
du -sh node_modules

# Buscar archivos
find . -name "*.js" | grep -v node_modules

# Contar líneas de código (sin node_modules)
find src -name "*.js" | xargs wc -l
```

---

## 📲 Expo Commands Dentro de la App

Una vez que ejecutas `npm start`, puedes presionar:

| Tecla | Acción |
|-------|--------|
| `a` | Abrir en Android |
| `i` | Abrir en iOS |
| `w` | Abrir en Web |
| `r` | Reload app |
| `m` | Toggle menu |
| `d` | Show developer menu |
| `j` | Open DevTools |
| `c` | Clear cache |

---

## 🐛 Solución de Problemas Comunes

### Error: "Unable to resolve module"

```bash
rm -rf node_modules package-lock.json
npm install
npm start -- --clear
```

### Error: "Metro bundler crashes"

```bash
# Matar todos los procesos de Node
killall node
npm start
```

### Error: "Android build failed"

```bash
cd android
./gradlew clean
cd ..
npm start
```

### Error: "Expo Go connection issues"

```bash
# Asegúrate de estar en la misma red WiFi
# O usa tunnel mode:
npm start -- --tunnel
```

---

## 📝 Scripts Personalizados

Puedes agregar estos scripts a `package.json`:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "clear": "expo start --clear",
    "tunnel": "expo start --tunnel"
  }
}
```

Luego úsalos con:

```bash
npm run clear    # Inicia limpiando caché
npm run tunnel   # Inicia con túnel (útil para redes con problemas)
```

---

## 🔐 Variables de Entorno

Si quieres mover la config de Firebase a variables de entorno:

```bash
# 1. Instalar dotenv
npm install dotenv

# 2. Crear .env
touch .env

# 3. Agregar variables
echo "FIREBASE_API_KEY=tu_api_key" >> .env
echo "FIREBASE_PROJECT_ID=tu_project_id" >> .env

# 4. En firebase.js, usar:
# import { FIREBASE_API_KEY } from '@env';
```

**Nota:** Recuerda agregar `.env` al `.gitignore`!

---

## 📦 Crear Build Local (sin EAS)

```bash
# Android
cd android
./gradlew assembleRelease

# El APK estará en:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 🚀 Deploy Automatizado (GitHub Actions)

Ejemplo de workflow para CI/CD:

```yaml
# .github/workflows/build.yml
name: Build App
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test (si tienes tests)
      - run: eas build --platform android --non-interactive
```

---

## 🎨 Modificar Iconos y Splash

```bash
# 1. Reemplaza estos archivos en /assets:
# - icon.png (1024x1024)
# - splash-icon.png (1024x1024)
# - adaptive-icon.png (1024x1024 con safe zone)

# 2. Configura en app.json:
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "backgroundColor": "#ffffff"
    }
  }
}
```

---

## 📱 Configurar Deep Links

```json
// app.json
{
  "expo": {
    "scheme": "gymadmin",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": { "scheme": "gymadmin" }
        }
      ]
    }
  }
}
```

Luego puedes abrir la app con:
```
gymadmin://clients
gymadmin://checkin
```

---

## ⚡ Performance Tips

```bash
# Habilitar Hermes (mejor performance)
# Ya viene habilitado por defecto en Expo SDK 54+

# Ver bundle size
npm run web
# Abre DevTools > Network > Tamaño del bundle JS

# Optimizar imágenes
npm install -g imageoptim-cli
imageoptim -d ./assets
```

---

## 📖 Documentación Oficial

- Expo: https://docs.expo.dev/
- React Native: https://reactnative.dev/
- Firebase: https://firebase.google.com/docs
- React Navigation: https://reactnavigation.org/

---

¡Estos comandos cubren el 99% de lo que necesitarás! 🚀
