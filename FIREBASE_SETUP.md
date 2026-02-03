# 🔥 Configuración de Firebase - Guía Paso a Paso

## 1️⃣ Crear Proyecto en Firebase

1. Ve a https://console.firebase.google.com/
2. Click en **"Agregar proyecto"**
3. Nombre del proyecto: `gym-admin` (o el que prefieras)
4. Desactiva Google Analytics (opcional)
5. Click en **"Crear proyecto"**

## 2️⃣ Configurar Authentication

1. En el menú lateral, click en **"Authentication"**
2. Click en **"Comenzar"**
3. En la pestaña **"Sign-in method"**, habilita:
   - ✅ **Email/Password** → Activar
4. Ve a la pestaña **"Users"**
5. Click en **"Agregar usuario"**
   - Email: `staff@gym.com` (o el que prefieras)
   - Password: `admin123` (cámbialo después)
6. Click en **"Agregar usuario"**

## 3️⃣ Configurar Firestore Database

1. En el menú lateral, click en **"Firestore Database"**
2. Click en **"Crear base de datos"**
3. Selecciona:
   - Ubicación: La más cercana a ti (ej: `us-central1`)
   - Modo: **"Empezar en modo de prueba"** (para desarrollo)
4. Click en **"Siguiente"** y luego **"Habilitar"**

### Reglas de Seguridad (importante!)

En la pestaña **"Reglas"**, reemplaza todo el contenido con:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados pueden leer y escribir
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Click en **"Publicar"**

## 4️⃣ Obtener Configuración de la Web App

1. Ve a **"Configuración del proyecto"** (ícono de engranaje en el menú lateral)
2. Baja hasta **"Tus apps"**
3. Click en el ícono **`</>`** (Web)
4. Registra la app:
   - Sobrenombre: `GymAdmin`
   - No marques Firebase Hosting
5. Click en **"Registrar app"**

6. **Copia la configuración** que aparece (será algo así):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "gym-admin-xxxxx.firebaseapp.com",
  projectId: "gym-admin-xxxxx",
  storageBucket: "gym-admin-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

7. **Pega esta configuración** en `src/services/firebase.js` reemplazando los valores `TU_*`

## 5️⃣ Datos de Ejemplo (Opcional)

Puedes agregar datos de prueba manualmente en Firestore:

### Agregar Cliente de Prueba

1. En **Firestore Database**, click en **"Iniciar colección"**
2. ID de colección: `clients`
3. Click en **"Siguiente"**
4. ID del documento: **Dejar en automático**
5. Agrega estos campos:

| Campo | Tipo | Valor |
|-------|------|-------|
| `name` | string | Juan Pérez |
| `phone` | string | 5551234567 |
| `email` | string | juan@example.com |
| `membershipType` | string | mensual |
| `membershipStart` | string | 2024-01-01 |
| `membershipEnd` | string | 2024-02-01 |
| `branchId` | string | sucursal1 |
| `createdAt` | timestamp | (Click en SET TO CURRENT TIME) |
| `updatedAt` | timestamp | (Click en SET TO CURRENT TIME) |

6. Click en **"Guardar"**

### Agregar Check-in de Prueba

1. Click en **"Iniciar colección"** (arriba a la izquierda)
2. ID de colección: `checkins`
3. ID del documento: **Dejar en automático**
4. Agrega estos campos:

| Campo | Tipo | Valor |
|-------|------|-------|
| `clientId` | string | (Copia el ID del cliente de arriba) |
| `clientName` | string | Juan Pérez |
| `branchId` | string | sucursal1 |
| `timestamp` | timestamp | (Click en SET TO CURRENT TIME) |

5. Click en **"Guardar"**

## 6️⃣ Verificar que Todo Funciona

### Checklist Final ✅

- [ ] Proyecto de Firebase creado
- [ ] Authentication habilitado (Email/Password)
- [ ] Usuario de staff creado
- [ ] Firestore Database creado
- [ ] Reglas de seguridad configuradas
- [ ] Configuración copiada a `src/services/firebase.js`
- [ ] (Opcional) Datos de ejemplo agregados

## 🔐 Seguridad para Producción

Cuando estés listo para producción, cambia las reglas de Firestore a algo más seguro:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo usuarios autenticados
    match /clients/{clientId} {
      allow read, write: if request.auth != null;
    }
    
    match /checkins/{checkinId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

También considera:
- Agregar roles de usuario (admin, staff, etc.)
- Validar datos con reglas más estrictas
- Habilitar facturación en Firebase para evitar límites
- Configurar backup automático de Firestore

## 📊 Límites del Plan Gratuito

Firebase Spark (gratis) incluye:
- **Firestore:** 1 GB de almacenamiento, 50k lecturas/día, 20k escrituras/día
- **Authentication:** Ilimitado para email/password
- **Hosting:** 10 GB de almacenamiento, 10 GB de transferencia/mes

Para un gimnasio pequeño (100-200 miembros), el plan gratuito es suficiente.

---

¿Tienes problemas? Revisa la [documentación oficial de Firebase](https://firebase.google.com/docs)
