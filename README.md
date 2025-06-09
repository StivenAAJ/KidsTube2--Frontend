# KidsTube 🎥

KidsTube es una plataforma de streaming diseñada específicamente para niños, que permite a los padres crear y gestionar perfiles restringidos para sus hijos, así como controlar el contenido que pueden ver a través de playlists personalizadas.

## 🚀 Características

- **Gestión de Usuarios**
  - Registro y autenticación de padres
  - Verificación por SMS
  - Creación de perfiles restringidos para niños
  - Control parental mediante PIN

- **Gestión de Contenido**
  - Carga y gestión de videos
  - Creación de playlists personalizadas
  - Asignación de playlists a perfiles específicos
  - Interfaz amigable para niños

- **Seguridad**
  - Autenticación JWT
  - Verificación en dos pasos
  - Control de acceso basado en roles
  - Protección de rutas

## 🛠️ Tecnologías Utilizadas

### Frontend
- Vue.js 3
- Tailwind CSS
- GraphQL (Queries y Mutaciones)
- Vue Router
- Heroicons

### Backend
- Node.js
- Express
- MongoDB
- GraphQL
- JWT para autenticación
- Twilio para SMS

## 📋 Prerrequisitos

- Node.js (v14 o superior)
- MongoDB
- Cuenta de Twilio para SMS
- Variables de entorno configuradas

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. **Instalar dependencias del frontend**
```bash
cd KidsTube2--Frontend
npm install
```

3. **Instalar dependencias del backend**
```bash
cd ../backend
npm install
```

4. **Configurar variables de entorno**

Crear archivo `.env` en el backend:
```env
PORT=3000
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_jwt_secret
TWILIO_ACCOUNT_SID=tu_twilio_sid
TWILIO_AUTH_TOKEN=tu_twilio_token
TWILIO_PHONE_NUMBER=tu_twilio_numero
```

5. **Iniciar el servidor de desarrollo**

Frontend:
```bash
npm run dev
```

Backend:
```bash
npm start
```

## 🗂️ Estructura del Proyecto

```

## 📱 Funcionalidades Principales

### Gestión de Usuarios
- Registro de padres con verificación por SMS
- Creación de perfiles restringidos para niños
- Gestión de PINs de acceso

### Gestión de Contenido
- Subida y administración de videos
- Creación y edición de playlists
- Asignación de contenido a perfiles específicos

### Sistema de Perfiles
- Perfiles independientes para cada niño
- Control parental mediante PIN
- Historial de visualización por perfil

## 🔐 Seguridad

- Autenticación mediante JWT
- Verificación en dos pasos con SMS
- Validación de PINs para acceso restringido
- Protección de rutas sensibles

## 📄 API GraphQL

El proyecto utiliza GraphQL para la comunicación entre frontend y backend. Las principales queries y mutaciones incluyen:

- Gestión de usuarios y perfiles
- Administración de videos
- Control de playlists
- Verificación de accesos

## 👥 Contribución

Si deseas contribuir al proyecto:

1. Haz un Fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia [TU_LICENCIA] - ver el archivo LICENSE.md para detalles

## ✉️ Contacto

Stiven Arguello Jimenez  - stivenaaj@gmail.com

Link del proyecto: https://github.com/StivenAAJ/KidsTube2---Frontend.git
