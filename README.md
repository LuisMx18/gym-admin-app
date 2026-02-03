# 🏋️ GymAdmin - Sistema de Administración de Gimnasio

App React Native para administrar un gimnasio con 2 sucursales.

## 📱 Funcionalidades

- ✅ Gestión de clientes (registrar, editar, buscar)
- ✅ Membresías con estados (activa, por vencer, vencida)
- ✅ Check-ins diarios
- ✅ Reportes de asistencia e ingresos
- ✅ Selector de sucursal (2 ubicaciones)
- ✅ Autenticación con Firebase

## 🚀 Instalación

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Agrega una Web App desde Project Settings
4. Copia la configuración de Firebase

5. Edita `src/services/firebase.js` y reemplaza:

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### 3. Configurar Firestore

1. En Firebase Console, ve a **Firestore Database**
2. Crea una base de datos en modo **Test** (o producción con reglas)
3. Las colecciones se crearán automáticamente cuando agregues el primer cliente

#### Reglas de Firestore Recomendadas

En Firestore > Rules, usa estas reglas (para desarrollo):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Crear Usuario de Staff

1. En Firebase Console, ve a **Authentication**
2. Habilita **Email/Password** como método de autenticación
3. Agrega un usuario manualmente (ejemplo: staff@gym.com / password123)

### 5. Ejecutar la App

```bash
# Android
npm run android

# iOS (requiere Mac)
npm run ios

# Web (para pruebas)
npm run web
```

## 📊 Estructura de Datos

### Colección: `clients`

```javascript
{
  name: string,
  phone: string,
  email: string,
  membershipType: 'diaria' | 'semanal' | 'quincenal' | 'mensual',
  membershipStart: string (YYYY-MM-DD),
  membershipEnd: string (YYYY-MM-DD),
  price: number,
  branchId: 'h7-life-fit' | 'balanx-h7',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Colección: `checkins`

```javascript
{
  clientId: string,
  clientName: string,
  branchId: 'h7-life-fit' | 'balanx-h7',
  timestamp: timestamp
}
```

## 🏢 Sucursales

La app está configurada para 2 gimnasios:

**H'7 Gym LIFE FIT**
- 📍 Col. Fovissste, calle Barreta 1297, Linares, N.L.
- Precios: Día $35 | Semana $150 | Quincena $250 | Mes $420

**BalanX H7 Gym**
- 📍 Col. San Gerardo La Petaca, Calle José San Martín #2074
- Precios: Día $35 | Semana $130 | Quincena $240 | Mes $350

Puedes cambiar los datos en `src/context/BranchContext.js`.

## 🔑 Login de Prueba

Después de crear el usuario en Firebase Authentication:

- **Email:** staff@gym.com
- **Password:** tu_contraseña

## 📱 Expo Go (Testing Rápido)

Si quieres probar sin instalar en Android:

1. Instala **Expo Go** en tu teléfono (Play Store / App Store)
2. Ejecuta: `npm start`
3. Escanea el QR code con Expo Go

## 🛠️ Tecnologías

- React Native + Expo
- Firebase (Firestore + Auth)
- React Navigation
- React Native Paper (Material Design)
- date-fns

## 📝 Notas

- Los datos se almacenan en la nube (Firebase)
- Requiere conexión a internet para funcionar
- Las membresías se marcan como "por vencer" cuando quedan 7 días o menos
- Los check-ins se pueden hacer incluso con membresías vencidas (con advertencia)

## 🎨 Personalización

### Cambiar Colores

Edita los componentes de React Native Paper en cada screen.

### Agregar Más Planes

Modifica `MEMBERSHIP_TYPES` en `src/screens/AddClientScreen.js`:

```javascript
const MEMBERSHIP_TYPES = [
  { value: 'diaria', label: 'Día', days: 1 },
  { value: 'semanal', label: 'Semana', days: 7 },
  { value: 'quincenal', label: 'Quincena', days: 15 },
  { value: 'mensual', label: 'Mes', days: 30 },
  // Agrega más aquí
];
```

También actualiza los precios en `BranchContext.js` para cada sucursal.

## 🚧 TODOs (Futuras Mejoras)

- [ ] Notificaciones push para membresías por vencer
- [ ] QR code para check-in rápido
- [ ] Exportar reportes a PDF/Excel
- [ ] Gestión de pagos con historial
- [ ] Modo offline con sincronización
- [ ] Panel web de administración

## 🐛 Problemas Comunes

**Error de conexión a Firebase:**
- Verifica que copiaste correctamente las credenciales
- Asegúrate de haber habilitado Firestore y Authentication

**La app no carga:**
- Ejecuta `npm install` de nuevo
- Borra caché: `npm start -- --clear`

**Errores de permisos en Firestore:**
- Revisa las reglas de Firestore en Firebase Console
- En desarrollo, usa las reglas de ejemplo arriba

---

¡Listo para administrar tu gimnasio! 💪
