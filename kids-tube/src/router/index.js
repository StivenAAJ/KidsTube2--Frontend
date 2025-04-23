// Importamos las dependencias necesarias para el router
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Register from '../pages/Register.vue'
import Terms from '../pages/Terms.vue'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import AddVideo from "../pages/AddVideo.vue"
import EditVideo from "../pages/EditVideo.vue"
import AddRestUser from "../pages/AddRestrictedUser.vue"
import EditRestUser from '../pages/EditRestrictedUser.vue'
import AddPlaylist from '../pages/AddPlaylist.vue'
import EditPlaylist from '../pages/EditPlaylist.vue'
import RestrictedUserLogin from '../pages/RestrictedUserLogin.vue'
import RestrictedPlaylists from '../pages/RestrictedPlaylists.vue'
import RestrictedPlayer from '../pages/RestrictedPlayer.vue'
import VerifyEmail from '../pages/VerifyEmail.vue'
import VerificationPending from '../pages/VerificationPending.vue'

const routes = [
  { 
    path: '/', 
    component: Home,
    meta: { requiresAuth: false }
  },
  { 
    path: '/register', 
    component: Register,
    meta: { requiresAuth: false }
  },
  { 
    path: '/terms', 
    component: Terms,
    meta: { requiresAuth: false }
  },
  { 
    path: '/login', 
    component: Login,
    meta: { requiresAuth: false }
  },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/add-video', 
    component: AddVideo,
    meta: { requiresAuth: true }
  },
  { 
    path: '/edit-video/:id', 
    component: EditVideo,
    meta: { requiresAuth: true }
  },
  { 
    path: '/add-restricted-user', 
    component: AddRestUser,
    meta: { requiresAuth: true }
  },
  { 
    path: '/edit-restricted-user/:id', 
    component: EditRestUser,
    meta: { requiresAuth: true }
  },
  { 
    path: '/add-playlist', 
    component: AddPlaylist,
    meta: { requiresAuth: true }
  },
  { 
    path: '/edit-playlist/:id', 
    component: EditPlaylist,
    meta: { requiresAuth: true }
  },
  { 
    path: '/restricted-user-login', 
    component: RestrictedUserLogin,
    meta: { requiresAuth: true } // Ahora requiere autenticación del padre
  },
  { 
    path: '/restricted-playlists', 
    component: RestrictedPlaylists,
    meta: { requiresAuth: true }
  },
  { 
    path: '/restricted-player/:id', 
    component: RestrictedPlayer,
    meta: { requiresAuth: true }
  },
  {
    path: '/verify-email/:token',
    component: VerifyEmail,
    meta: { requiresAuth: false }
  },
  {
    path: '/verification-pending',
    component: VerificationPending,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Función para verificar el estado del usuario
async function checkUserStatus(token) {
  try {
    const response = await fetch('http://localhost:3000/users/check-status', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Error verificando estado');
    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error('Error checking user status:', error);
    return null;
  }
}

// Guard de navegación actualizado
router.beforeEach(async (to, from, next) => {
  const token = sessionStorage.getItem('token');
  const isPublicRoute = to.meta.requiresAuth === false;
  const isVerificationRoute = to.path.startsWith('/verify-email') || 
                            to.path === '/verification-pending';

  // Si es una ruta de verificación, permitir acceso
  if (isVerificationRoute) {
    next();
    return;
  }

  // Si la ruta requiere autenticación y no hay token
  if (!isPublicRoute && !token) {
    next({ path: '/login' });
    return;
  }

  // Si hay token, verificar el estado del usuario
  if (token) {
    const userStatus = await checkUserStatus(token);
    
    // Si el usuario está pendiente y no está en una ruta pública
    if (userStatus === 'pending' && !isPublicRoute) {
      // Permitir acceso solo a rutas públicas y verification-pending
      if (to.path !== '/verification-pending') {
        next({ path: '/verification-pending' });
        return;
      }
    }

    // Si el usuario está verificado e intenta acceder a páginas públicas
    if (userStatus === 'active' && isPublicRoute && to.path !== '/') {
      next({ path: '/dashboard' });
      return;
    }
  }

  next();
});

export default router
