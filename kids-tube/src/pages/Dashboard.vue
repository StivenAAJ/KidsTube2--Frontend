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

        <ul class="space-y-2">
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

        <ul class="space-y-2">
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

        <ul class="space-y-2">
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
  
  <script>
import { ref, onMounted } from "vue";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/solid";
const avatarImages = import.meta.glob("/src/assets/avatars/*.png", { eager: true });

export default {
  name: "DashboardPage",
  components: { PlusIcon, PencilIcon, TrashIcon },
  setup() {
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

    const deleteVideo = async (id) => {
      if (!confirm("¿Seguro que deseas eliminar este video?")) return;
      
      try {
        await fetch(`http://localhost:3000/videos/${id}`, { method: "DELETE" });
        fetchVideos();
      } catch (error) {
        console.error("Error al eliminar el video:", error);
      }
    };

    const goToAddVideo = () => {
      window.location.href = "/add-video"; // Ruta de la página de agregar video
    };

    const goToEditVideo = (id) => {
      window.location.href = `/edit-video/${id}`; // Ruta de la página de editar video
    };

    onMounted(fetchVideos);

    const fetchRestrictedUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/restrictedUsers");
        restrictedUsers.value = await response.json();
      } catch (error) {
        console.error("Error al obtener los usuarios restringidos:", error);
      }
    };

    const getAvatarUrl = (avatarPath) => {
      if (!avatarPath) return "/src/assets/avatars/default.png"; // Avatar por defecto
      const fileName = avatarPath.split("/").pop(); 
      return avatarImages[`/src/assets/avatars/${fileName}`]?.default || "/src/assets/avatars/default.png";
    };

    const deleteRestrictedUser = async (id) => {
      if (!confirm("¿Seguro que deseas eliminar este usuario restringido?")) return;

      try {
        await fetch(`http://localhost:3000/restrictedUsers/${id}`, { method: "DELETE" });
        fetchRestrictedUsers();
      } catch (error) {
        console.error("Error al eliminar el usuario restringido:", error);
      }
    };

    const goToAddRestrictedUser = () => {
      window.location.href = "/add-restricted-user";
    };

    const goToEditRestrictedUser = (id) => {
      window.location.href = `/edit-restricted-user/${id}`;
    };

    onMounted(fetchRestrictedUsers);

    // Obtener Playlists
    const fetchPlaylists = async () => {
      try {
        const response = await fetch("http://localhost:3000/playlists");
        playlists.value = await response.json();
      } catch (error) {
        console.error("Error al obtener las playlists:", error);
      }
    };

    // Eliminar Playlist
    const deletePlaylist = async (id) => {
      if (!confirm("¿Seguro que deseas eliminar esta playlist?")) return;
      
      try {
        await fetch(`http://localhost:3000/playlists/${id}`, { method: "DELETE" });
        fetchPlaylists();
      } catch (error) {
        console.error("Error al eliminar la playlist:", error);
      }
    };

    // Redirecciones
    const goToAddPlaylist = () => {
      window.location.href = "/add-playlist";
    };

    const goToEditPlaylist = (id) => {
      window.location.href = `/edit-playlist/${id}`;
    };

    onMounted(fetchPlaylists);


    return { videos, deleteVideo, goToAddVideo, goToEditVideo,
      restrictedUsers, deleteRestrictedUser, goToAddRestrictedUser, goToEditRestrictedUser, getAvatarUrl,
      playlists, deletePlaylist, goToAddPlaylist, goToEditPlaylist,
     };     
  },
};
</script>
  
  <style scoped>
  </style>