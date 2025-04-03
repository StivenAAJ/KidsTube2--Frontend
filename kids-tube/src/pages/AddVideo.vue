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
  
  <script>
  import { ref } from "vue";
  
  export default {
    name: "AddVideo",
    setup() {
    const video = ref({
      title: "",
      videoUrl: "",
      description: "",
    });
  
    const createVideo = async () => {
    try {
        await fetch("http://localhost:3000/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(video.value),
        });
        window.location.href = "/dashboard";
    } catch (error) {
        console.error("Error al agregar el video:", error);
    }
    };
  
    const goBack = () => {
        window.history.back();
    };
  
    return { video, createVideo, goBack };
    },
  };
  </script>
  