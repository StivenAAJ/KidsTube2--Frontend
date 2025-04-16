<template>
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-300">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Agregar Playlist</h2>
  
        <form @submit.prevent="createPlaylist">
          <!-- Nombre de la Playlist -->
          <label class="block text-gray-700">Nombre de la Playlist</label>
          <input v-model="playlist.name" type="text" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4" />
  
          <!-- Selección de Perfiles -->
          <label class="block text-gray-700">Perfiles Asociados</label>
          <div v-for="profile in profiles" :key="profile._id" class="flex items-center mb-2 text-black">
            <input type="checkbox" :value="profile._id" v-model="playlist.profiles" class="mr-2 text-black" />
            <span>{{ profile.fullName }}</span>
          </div>
  
          <div class="flex justify-between mt-4">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Guardar</button>
            <button type="button" @click="goBack" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter } from 'vue-router';
  import { useTokenValidation } from '../composables/useTokenValidation';
  
  const { validateToken } = useTokenValidation();
  const router = useRouter();
  
  const playlist = ref({ name: "", profiles: [] });
  const profiles = ref([]);
  
  // Obtener perfiles disponibles
  const fetchProfiles = async () => {
    try {
      const response = await fetch("http://localhost:3000/restrictedUsers");
      profiles.value = await response.json();
    } catch (error) {
      console.error("Error al obtener los perfiles:", error);
    }
  };
  
  // Crear Playlist
  const createPlaylist = async () => {
    if (!validateToken()) return;
    
    try {
      const response = await fetch("http://localhost:3000/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playlist.value),
      });
      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error("Error al crear la playlist:", await response.json());
      }
    } catch (error) {
      console.error("Error al crear la playlist:", error);
    }
  };
  
  const goBack = () => {
    router.push('/dashboard');
  };
  
  onMounted(async () => {
    if (validateToken()) {
      await fetchProfiles();
    }
  });
  </script>
  