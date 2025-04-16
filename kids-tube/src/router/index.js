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
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación simplificado
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  const isPublicRoute = to.meta.requiresAuth === false

  // Si la ruta requiere autenticación y no hay token
  if (!isPublicRoute && !token) {
    next({ path: '/login' })
    return
  }

  // Si el usuario está autenticado e intenta acceder a páginas públicas (login/registro)
  if (token && isPublicRoute) {
    next({ path: '/dashboard' })
    return
  }

  next()
})

export default router
