<template>
  <div class="items-center justify-center bg-gradient-to-r from-blue-400 to-orange-300 outline">
    <div class="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 class="text-xl font-bold mb-4">Editar Video</h2>

      <!-- Campo de búsqueda -->
      <label class="block text-gray-700">Buscar en YouTube</label>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar videos..."
        class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4"
      />
      <button
        @click="searchVideos"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Buscar
      </button>

      <!-- Resultados de búsqueda -->
      <div v-if="searchResults.length > 0" class="mb-4">
        <h3 class="text-gray-700 font-bold mb-2">Resultados:</h3>
        <ul class="space-y-2">
          <li
            v-for="video in searchResults"
            :key="video._id"
            class="flex items-center space-x-2 p-2 border rounded hover:bg-gray-100 cursor-pointer"
            @click="selectVideo(video)"
          >
            <img :src="video.thumbnail" alt="Thumbnail" class="w-16 h-16 rounded" />
            <div>
              <p class="text-sm font-bold">{{ video.title }}</p>
              <p class="text-xs text-gray-500">{{ video.description }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Video seleccionado -->
      <div v-if="selectedVideo" class="mb-4">
        <h3 class="text-gray-700 font-bold mb-2">Video Seleccionado:</h3>
        <div class="flex items-center space-x-2 p-2 border rounded">
          <img :src="selectedVideo.thumbnail" alt="Thumbnail" class="w-16 h-16 rounded" />
          <div>
            <p class="text-sm font-bold">{{ selectedVideo.title }}</p>
            <p class="text-xs text-gray-500">{{ selectedVideo.description }}</p>
          </div>
        </div>
      </div>

      <!-- Formulario de edición -->
      <form @submit.prevent="updateVideo">
        <label class="block text-gray-700">Título</label>
        <input
          v-model="video.title"
          type="text"
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4"
          required
        />

        <label class="block text-gray-700">URL del vídeo</label>
        <input
          v-model="video.videoUrl"
          type="text"
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4"
          required
        />

        <label class="block text-gray-700">Descripción</label>
        <textarea
          v-model="video.description"
          rows="3"
          class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4"
        ></textarea>

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
import { youtubeService } from "../services/youtubeService";
import { useTokenValidation } from "../composables/useTokenValidation";

const { validateToken } = useTokenValidation();
const router = useRouter();
const route = useRoute();

const video = ref({
  title: "",
  videoUrl: "",
  description: "",
});

const searchQuery = ref("");
const searchResults = ref([]);
const selectedVideo = ref(null);
const error = ref("");

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
    error.value = "Error al cargar el video";
    console.error("Error:", err);
  }
};

const searchVideos = async () => {
  try {
    searchResults.value = await youtubeService.searchVideos(searchQuery.value);
  } catch (error) {
    console.error("Error buscando videos:", error);
    alert("Hubo un error al buscar los videos.");
  }
};

const selectVideo = (videoData) => {
  selectedVideo.value = videoData;
  video.value.title = videoData.title;
  video.value.videoUrl = videoData.videoUrl;
  video.value.description = videoData.description;
};

const updateVideo = async () => {
  if (!validateToken()) return;

  try {
    const response = await fetch(`http://localhost:3000/videos/${route.params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: video.value.title,
        videoUrl: video.value.videoUrl,
        description: video.value.description,
      }),
    });

    if (response.ok) {
      router.push("/dashboard");
    } else {
      const data = await response.json();
      error.value = data.message || "Error al actualizar el video";
    }
  } catch (err) {
    error.value = "Error al actualizar el video";
    console.error("Error:", err);
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


