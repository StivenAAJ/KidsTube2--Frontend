<template>
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-300">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Editar Playlist</h2>
  
        <form @submit.prevent="updatePlaylist">
          <!-- Nombre de la Playlist -->
          <label class="block text-gray-700">Nombre de la Playlist</label>
          <input v-model="playlist.name" type="text" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4" />
  
          <!-- Selección de Perfiles -->
          <label class="block text-gray-700">Perfiles Asociados</label>
          <div v-for="profile in profiles" :key="profile._id" class="flex items-center mb-2 text-black">
            <input type="checkbox" :value="profile._id" v-model="playlist.profiles" class="mr-2 text-black" />
            <span>{{ profile.fullName }}</span>
          </div>
  
          <!-- Selección de Videos -->
          <label class="block text-gray-700">Videos en la Playlist</label>
          <div v-for="video in videos" :key="video._id" class="flex items-center mb-2 text-black">
            <input type="checkbox" :value="video._id" v-model="playlist.videos" class="mr-2 text-black" />
            <span>{{ video.title }}</span>
          </div>
  
          <div class="flex justify-between mt-4">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Guardar Cambios</button>
            <button type="button" @click="goBack" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  
  export default {
    setup() {
      const route = useRoute();
      const playlist = ref({ name: "", profiles: [], videos: [] });
      const profiles = ref([]);
      const videos = ref([]);
  
      // Obtener datos de la playlist
      const fetchPlaylist = async () => {
        try {
          const response = await fetch(`http://localhost:3000/playlists/${route.params.id}`);
          playlist.value = await response.json();
        } catch (error) {
          console.error("Error al obtener la playlist:", error);
        }
      };
  
      // Obtener perfiles y videos
      const fetchProfiles = async () => {
        try {
          const response = await fetch("http://localhost:3000/restrictedUsers");
          profiles.value = await response.json();
        } catch (error) {
          console.error("Error al obtener los perfiles:", error);
        }
      };
  
      const fetchVideos = async () => {
        try {
          const response = await fetch("http://localhost:3000/videos");
          videos.value = await response.json();
        } catch (error) {
          console.error("Error al obtener los videos:", error);
        }
      };
  
      // Actualizar Playlist
      const updatePlaylist = async () => {
        try {
          await fetch(`http://localhost:3000/playlists/${route.params.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playlist.value),
          });
          window.location.href = "/dashboard"; // Redirigir después de actualizar
        } catch (error) {
          console.error("Error al actualizar la playlist:", error);
        }
      };
  
      const goBack = () => {
        window.location.href = "/dashboard";
      };
  
      onMounted(() => {
        fetchPlaylist();
        fetchProfiles();
        fetchVideos();
      });
  
      return { playlist, profiles, videos, updatePlaylist, goBack };
    },
  };
  </script>
  