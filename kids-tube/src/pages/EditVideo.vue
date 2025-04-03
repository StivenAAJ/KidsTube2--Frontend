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
  
  <script>
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import { videoPatch } from "../services/videoFunctions"; // Ruta correcta al archivo de funciones
  
  export default {
    name: "EditVideo",
    setup() {
      const route = useRoute();
      const id = route.params.id;
  
      const video = ref({
        title: "",
        videoUrl: "",
        description: "",
      });
  
      const fetchVideo = async () => {
        try {
          const response = await fetch(`http://localhost:3000/videos?id=${id}`);
          const data = await response.json();
          video.value = {
            title: data.title,
            videoUrl: data.videoUrl,
            description: data.description,
          };
        } catch (error) {
          console.error("Error al obtener el video:", error);
        }
      };
  
      const updateVideo = async () => {
        try {
          await videoPatch(id, video.value);
          window.location.href = "/dashboard";
        } catch (error) {
          console.error("Error al actualizar el video:", error);
        }
      };
  
      const goBack = () => {
        window.history.back();
      };
  
      onMounted(fetchVideo);
  
      return { video, updateVideo, goBack };
    },
  };
  </script>
  
  
  