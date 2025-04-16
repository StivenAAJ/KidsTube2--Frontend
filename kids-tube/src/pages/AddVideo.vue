<template>
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-red-300">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Agregar/Editar Video</h2>
  
        <form @submit.prevent="createVideo">
          <label class="block text-gray-700">Título</label>
          <input v-model="video.title" type="text" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500  text-black mb-4" />

          <label class="block text-gray-700">URL del vídeo</label>
          <input v-model="video.videoUrl" rows="3" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4"></input>
  
          <label class="block text-gray-700">Descripción</label>
          <textarea v-model="video.description" rows="3" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4"></textarea>
  
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
  
  const video = ref({
    title: "",
    videoUrl: "",
    description: "",
  });
  
  const error = ref('');
  
  const createVideo = async () => {
    if (!validateToken()) return;
  
    try {
      const response = await fetch("http://localhost:3000/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(video.value),
      });
  
      if (response.ok) {
        router.push('/dashboard');
      } else {
        const data = await response.json();
        error.value = data.message || 'Error al agregar el video';
      }
    } catch (err) {
      error.value = 'Error al agregar el video';
      console.error('Error:', err);
    }
  };
  
  const goBack = () => {
    window.history.back();
  };
  
  onMounted(() => {
    validateToken();
  });
  </script>
  