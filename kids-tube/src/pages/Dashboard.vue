<template>
    <div class="min-h-screen bg-gradient-to-r from-blue-100 to-purple-300">
  
      <!-- Contenido del Dashboard -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Sección de Perfiles -->
        <section class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Usuarios Restringidos</h2>
          <button @click="goToAddRestrictedUser" class="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
            <PlusIcon class="w-6 h-6" />
          </button>
        </div>

        <div v-if="loadingUsers">Cargando usuarios...</div>
        <div v-else-if="usersError">Error: {{ usersError.message }}</div>
        <ul v-else class="space-y-2">
          <li v-for="user in restrictedUsers" :key="user._id" class="bg-gradient-to-r from-blue-400 to-red-400 p-4 flex justify-between items-center rounded shadow">
            <div class="flex items-center space-x-3">
              <img :src="getAvatarUrl(user.avatar)" alt="Avatar" class="w-10 h-10 rounded-full border border-white shadow-md">
              <span>{{ user.fullName }} - PIN: {{ user.pin }}</span>
            </div>
            <div class="space-x-2">
              <button @click="goToEditRestrictedUser(user._id)" class="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600">
                <PencilIcon class="w-5 h-5" />
              </button>
              <button @click="deleteRestrictedUser(user._id)" class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </li>
        </ul>
      </section>
  
        <!-- Sección de Playlists -->
        <section class="mb-12">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Playlists</h2>
          <button @click="goToAddPlaylist" class="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
            <PlusIcon class="w-6 h-6" />
          </button>
        </div>

        <div v-if="loadingPlaylists">Cargando playlists...</div>
        <div v-else-if="playlistsError">Error: {{ playlistsError.message }}</div>
        <ul v-else class="space-y-2">
          <li v-for="playlist in playlists" :key="playlist._id" class="bg-gradient-to-r from-green-400 to-yellow-300 p-4 flex justify-between items-center rounded shadow">
            <div class="flex items-center space-x-3">
              <span>{{ playlist.name }} - {{ playlist.profiles.length }} perfiles</span>
            </div>
            <div class="space-x-2">
              <button @click="goToEditPlaylist(playlist._id)" class="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600">
                <PencilIcon class="w-5 h-5" />
              </button>
              <button @click="deletePlaylist(playlist._id)" class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </li>
        </ul>
      </section>

      <!-- Sección de Videos -->
      <section>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">Videos</h2>
          <button @click="goToAddVideo" class="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
            <PlusIcon class="w-6 h-6" />
          </button>
        </div>

        <div v-if="loadingVideos">Cargando videos...</div>
        <div v-else-if="videosError">Error: {{ videosError.message }}</div>
        <ul v-else class="space-y-2">
          <li v-for="video in videos" :key="video._id" class="bg-gradient-to-r from-blue-400 to-orange-300 p-4 flex justify-between items-center rounded shadow">
            <span>{{ video.title }} - {{ video.description }}</span>
            <div class="space-x-2">
              <button @click="goToEditVideo(video._id)" class="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600">
                <PencilIcon class="w-5 h-5" />
              </button>
              <button @click="deleteVideo(video._id)" class="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </li>
        </ul>
      </section>
      </div>

      <router-link to="/restricted-user-login" class="text-gray-700 hover:text-blue-900 font-bold size-lg">Elegir un perfil</router-link>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { useTokenValidation } from '../composables/useTokenValidation';
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/solid";
import { GET_VIDEOS, GET_PLAYLISTS, GET_RESTRICTED_USERS } from '../graphQL/queries'

const { validateToken } = useTokenValidation();
const router = useRouter();
const avatarImages = import.meta.glob('/src/assets/avatars/*.png', { eager: true })

const videos = ref([]);
const restrictedUsers = ref([]);
const playlists = ref([]);

const fetchVideos = async () => {
  try {
    const response = await fetch("http://localhost:3000/videos");
    videos.value = await response.json();
  } catch (error) {
    console.error("Error al obtener los videos:", error);
  }
};

const fetchRestrictedUsers = async () => {
  try {
    const response = await fetch("http://localhost:3000/restrictedUsers");
    restrictedUsers.value = await response.json();
  } catch (error) {
    console.error("Error al obtener los usuarios restringidos:", error);
  }
};

const fetchPlaylists = async () => {
  try {
    const response = await fetch("http://localhost:3000/playlists");
    playlists.value = await response.json();
  } catch (error) {
    console.error("Error al obtener las playlists:", error);
  }
};

const deleteVideo = async (id) => {
  if (!validateToken()) return;
  if (!confirm("¿Seguro que deseas eliminar este video?")) return;
  
  try {
    await fetch(`http://localhost:3000/videos/${id}`, { method: "DELETE" });
    fetchVideos();
  } catch (error) {
    console.error("Error al eliminar el video:", error);
  }
};

const deleteRestrictedUser = async (id) => {
  if (!validateToken()) return;
  if (!confirm("¿Seguro que deseas eliminar este usuario restringido?")) return;

  try {
    await fetch(`http://localhost:3000/restrictedUsers/${id}`, { method: "DELETE" });
    fetchRestrictedUsers();
  } catch (error) {
    console.error("Error al eliminar el usuario restringido:", error);
  }
};

const deletePlaylist = async (id) => {
  if (!validateToken()) return;
  if (!confirm("¿Seguro que deseas eliminar esta playlist?")) return;
  
  try {
    await fetch(`http://localhost:3000/playlists/${id}`, { method: "DELETE" });
    fetchPlaylists();
  } catch (error) {
    console.error("Error al eliminar la playlist:", error);
  }
};

const goToAddVideo = () => {
  if (!validateToken()) return;
  router.push('/add-video');
};

const goToEditVideo = (id) => {
  if (!validateToken()) return;
  router.push(`/edit-video/${id}`);
};

const goToAddRestrictedUser = async () => {
  try {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No se encontró ID de usuario');
      router.push('/login');
      return;
    }
    
    // Verificar el estado del usuario antes de navegar
    const response = await fetch('http://localhost:3000/users/check-status', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Error verificando estado del usuario');
    }

    const data = await response.json();
    if (data.status === 'active') {
      router.push('/add-restricted-user');
    } else {
      console.error('Usuario no activo');
      router.push('/verification-pending');
    }
  } catch (error) {
    console.error('Error:', error);
    // Manejar el error apropiadamente
  }
};

const goToEditRestrictedUser = (id) => {
  if (!validateToken()) return;
  router.push(`/edit-restricted-user/${id}`);
};

const goToAddPlaylist = () => {
  if (!validateToken()) return;
  router.push('/add-playlist');
};

const goToEditPlaylist = (id) => {
  if (!validateToken()) return;
  
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.error('No hay token de autenticación');
    router.push('/login');
    return;
  }

  router.push(`/edit-playlist/${id}`);
};

const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return '/src/assets/avatars/default.png'
  const fileName = avatarPath.split('/').pop()
  return avatarImages[`/src/assets/avatars/${fileName}`]?.default || '/src/assets/avatars/default.png'
}

onMounted(async () => {
  if (validateToken()) {
    await Promise.all([
      fetchVideos(),
      fetchRestrictedUsers(),
      fetchPlaylists()
    ]);
  }
});
</script>
  
  <style scoped>
  </style>