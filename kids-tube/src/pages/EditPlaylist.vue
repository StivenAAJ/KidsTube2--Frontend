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
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useTokenValidation } from '../composables/useTokenValidation';
  
  const { validateToken } = useTokenValidation();
  const router = useRouter();
  const route = useRoute();
  
  const name = ref('');
  const selectedVideos = ref([]);
  const selectedProfiles = ref([]);
  const videos = ref([]);
  const restrictedUsers = ref([]);
  const error = ref('');
  
  const loadData = async () => {
    try {
      const [playlistResponse, videosResponse, usersResponse] = await Promise.all([
        fetch(`http://localhost:3000/playlists/${route.params.id}`),
        fetch('http://localhost:3000/videos'),
        fetch('http://localhost:3000/restrictedUsers')
      ]);
      
      const playlist = await playlistResponse.json();
      videos.value = await videosResponse.json();
      restrictedUsers.value = await usersResponse.json();
  
      name.value = playlist.name;
      selectedVideos.value = playlist.videos.map(v => v._id);
      selectedProfiles.value = playlist.profiles.map(p => p._id);
    } catch (err) {
      error.value = 'Error al cargar datos';
      console.error('Error:', err);
    }
  };
  
  const handleSubmit = async () => {
    if (!validateToken()) return;
    
    try {
      const response = await fetch(`http://localhost:3000/playlists/${route.params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.value,
          videos: selectedVideos.value,
          profiles: selectedProfiles.value
        }),
      });
  
      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json();
        error.value = data.message || 'Error al actualizar la playlist';
      }
    } catch (err) {
      error.value = 'Error al actualizar la playlist';
      console.error('Error:', err);
    }
  };
  
  const goBack = () => {
    router.push('/dashboard');
  };
  
  onMounted(async () => {
    if (validateToken()) {
      await loadData();
    }
  });
  </script>
  