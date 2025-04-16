<template>
  <div class="p-6 bg-gradient-to-br from-pink-500 to-cyan-500">
    <h1 class="text-2xl font-bold mb-4">Reproductor</h1>

    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="!currentPlaylist">No se encontró la playlist</div>
    <div v-else>
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
        <p class="mt-2 text-sm text-gray-700">{{ selectedVideo.description }}</p>
      </div>

      <!-- Lista de videos en miniatura -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div 
          v-for="video in filteredVideos" 
          :key="video._id" 
          class="cursor-pointer p-2 bg-white shadow-md rounded-lg hover:bg-gray-200 transition"
          @click="selectVideo(video)"
        >
          <img 
            v-if="getYoutubeThumbnail(video.videoUrl)"
            :src="getYoutubeThumbnail(video.videoUrl)"
            class="w-full h-32 md:h-40 rounded object-cover"
            :alt="video.title"
          />
          <p class="text-sm text-center mt-2 text-black">{{ video.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { GET_PLAYLIST } from '../graphQL/queries';
import { useTokenValidation } from '../composables/useTokenValidation';

const route = useRoute();
const { validateToken } = useTokenValidation();
const searchQuery = ref('');
const selectedVideo = ref(null);

// GraphQL query
const { result, loading, error } = useQuery(
  GET_PLAYLIST,
  () => ({
    id: route.params.id
  }),
  {
    fetchPolicy: 'cache-and-network'
  }
);

// Computed properties
const currentPlaylist = computed(() => result.value?.playlist);

const filteredVideos = computed(() => {
  if (!currentPlaylist.value?.videos) return [];
  return currentPlaylist.value.videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Utility functions
const formatYouTubeUrl = (url) => {
  if (!url) return '';
  let videoId = '';
  
  try {
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    }
    return `https://www.youtube.com/embed/${videoId}`;
  } catch (error) {
    console.error('Error formatting YouTube URL:', error);
    return '';
  }
};

const getYoutubeThumbnail = (url) => {
  if (!url) return '';
  let videoId = '';
  
  try {
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1].split('&')[0];
    }
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  } catch (error) {
    console.error('Error getting YouTube thumbnail:', error);
    return '';
  }
};

// Event handlers
const selectVideo = (video) => {
  selectedVideo.value = video;
};

// Watchers
watch(currentPlaylist, (newPlaylist) => {
  if (newPlaylist?.videos?.length > 0 && !selectedVideo.value) {
    selectedVideo.value = newPlaylist.videos[0];
  }
}, { immediate: true });

// Lifecycle hooks
validateToken();
</script>
