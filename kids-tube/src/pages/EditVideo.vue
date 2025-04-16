<template>
    <div class="items-center justify-center bg-gradient-to-r from-blue-400 to-orange-300 outline">
      <div class="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 class="text-xl font-bold mb-4">Editar Video</h2>
  
        <form @submit.prevent="updateVideo">
          <label class="block text-gray-700">Título</label>
          <input v-model="video.title" type="text" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4" required />
  
          <label class="block text-gray-700">URL del vídeo</label>
          <input v-model="video.videoUrl" rows="3" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4" required />
  
          <label class="block text-gray-700">Descripción</label>
          <textarea v-model="video.description" rows="3" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4"></textarea>
  
          <div class="flex justify-between mt-4">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Actualizar</button>
            <button @click="goBack" class="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useTokenValidation } from '../composables/useTokenValidation';
  
  const { validateToken } = useTokenValidation();
  const router = useRouter();
  const route = useRoute();
  
  const video = ref({
    title: "",
    videoUrl: "",
    description: "",
  });
  
  const error = ref('');
  
  const loadVideo = async () => {
    try {
      const response = await fetch(`http://localhost:3000/videos/${route.params.id}`);
      const data = await response.json();
      video.value = {
        title: data.title,
        videoUrl: data.videoUrl,
        description: data.description,
      };
    } catch (err) {
      error.value = 'Error al cargar el video';
      console.error('Error:', err);
    }
  };
  
  const updateVideo = async () => {
    if (!validateToken()) return;
    
    try {
      const response = await fetch(`http://localhost:3000/videos/${route.params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: video.value.title,
          videoUrl: video.value.videoUrl,
          description: video.value.description,
        }),
      });
  
      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json();
        error.value = data.message || 'Error al actualizar el video';
      }
    } catch (err) {
      error.value = 'Error al actualizar el video';
      console.error('Error:', err);
    }
  };
  
  const goBack = () => {
    window.history.back();
  };
  
  onMounted(async () => {
    if (validateToken()) {
      await loadVideo();
    }
  });
  </script>
  
  
  