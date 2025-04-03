<template>
  <div class="p-6 bg-gradient-to-br from-pink-500 to-cyan-500">
    <h1 class="text-2xl font-bold mb-4">Reproductor</h1>

    <!-- Barra de búsqueda -->
    <input 
      type="text"
      v-model="searchQuery"
      placeholder="Buscar video..."
      class="p-2 border rounded w-full mb-4"
    />

    <!-- Video principal seleccionado -->
    <div v-if="selectedVideo" class="mb-6">
      <h2 class="text-lg font-bold text-black">{{ selectedVideo.title }}</h2>
      <iframe 
        :src="formatYouTubeUrl(selectedVideo.videoUrl)" 
        class="w-full h-[500px] max-w-4xl mx-auto rounded-lg shadow-lg"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>

    <!-- Lista de videos en miniatura -->
    <div v-if="playlist" class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div 
        v-for="video in filteredVideos" 
        :key="video._id" 
        class="cursor-pointer p-2 bg-white shadow-md rounded-lg hover:bg-gray-200 transition"
        @click="selectVideo(video)"
      >
        <iframe 
          class="w-full h-32 md:h-40 rounded"
          :src="video.videoUrl"
          frameborder="0"
          allowfullscreen>
        </iframe>
        <p class="text-sm text-center mt-2 text-black">{{ video.title }}</p>
      </div>
    </div>

    <div v-else>
      Cargando playlist...
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const playlist = ref(null);
const selectedVideo = ref(null);
const searchQuery = ref("");

// Obtener la playlist por su ID
const fetchPlaylist = async () => {
  try {
    const response = await fetch(`http://localhost:3000/playlists/by-id?playlistId=${route.params.id}`);
    const data = await response.json();
    
    if (data) {
      playlist.value = data;
      selectedVideo.value = data.videos[0]; // Seleccionar el primer video por defecto
    } else {
      console.warn("Playlist no encontrada.");
    }
  } catch (error) {
    console.error("Error al obtener la playlist", error);
  }
};

const formatYouTubeUrl = (url) => {
  let videoId = "";

  if (url.includes("youtu.be")) {
    videoId = url.split("youtu.be/")[1].split("?")[0]; // Extraer ID del video
  } else if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1].split("&")[0];
  }

  return `https://www.youtube.com/embed/${videoId}`;
};

// Filtrar videos según la búsqueda
const filteredVideos = computed(() => {
  if (!playlist.value) return [];
  return playlist.value.videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Cambiar el video principal al hacer clic en una miniatura
const selectVideo = (video) => {
  selectedVideo.value = video;
};


onMounted(fetchPlaylist);
</script>
