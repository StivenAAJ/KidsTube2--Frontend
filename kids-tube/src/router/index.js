// Importamos las dependencias necesarias para el router
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Videos from '../pages/Videos.vue'
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
  { path: '/', component: Home },
  { path: '/videos', component: Videos },
  { path: '/register', component: Register },
  { path: '/terms', component: Terms },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard},
  { path: '/add-video', component: AddVideo},
  { path: '/edit-video/:id', component: EditVideo},
  { path: '/add-restricted-user', component: AddRestUser},
  { path: '/edit-restricted-user/:id', component: EditRestUser},
  { path: '/add-playlist', component: AddPlaylist},
  { path: '/edit-playlist/:id', component: EditPlaylist},
  { path: '/restricted-user-login', component: RestrictedUserLogin},
  { path: '/restricted-playlists', component: RestrictedPlaylists},
  { path: '/restricted-player/:id', component: RestrictedPlayer},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
