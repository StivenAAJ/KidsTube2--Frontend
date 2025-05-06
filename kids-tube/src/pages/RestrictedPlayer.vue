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
          v-for="video in currentPlaylist.videos" 
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
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { GET_PLAYLIST } from '../graphQL/queries';
import { useTokenValidation } from '../composables/useTokenValidation';

const route = useRoute();
const router = useRouter();
const { validateToken } = useTokenValidation();
const searchQuery = ref('');
const selectedVideo = ref(null);
const restrictedUser = ref(null);

// Obtener el usuario restringido desde sessionStorage
onMounted(() => {
  const user = sessionStorage.getItem('restrictedUser');
  if (user) {
    restrictedUser.value = JSON.parse(user);
  } else {
    console.error('No se encontró el usuario restringido en sessionStorage');
    router.push('/login'); // Redirigir al login si no hay usuario restringido
  }
});

// Verificar si el ID de la playlist es válido
if (!route.params.id) {
  console.error('No se proporcionó un ID de playlist válido');
  router.push('/'); // Redirigir a la página principal si no hay ID
}

// GraphQL query
const { result, loading, error, refetch } = useQuery(
  GET_PLAYLIST,
  () => ({
    id: route.params.id,
    searchQuery: searchQuery.value // Pasar el argumento searchQuery
  }),
  {
    fetchPolicy: 'cache-and-network'
  }
);

// Computed properties
const currentPlaylist = computed(() => result.value?.playlist);

// Watchers
watch(searchQuery, () => {
  refetch(); // Refetch la consulta cuando cambie el valor de searchQuery
});

watch(currentPlaylist, (newPlaylist) => {
  if (newPlaylist?.videos?.length > 0 && !selectedVideo.value) {
    selectedVideo.value = newPlaylist.videos[0];
  }
}, { immediate: true });

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

// Lifecycle hooks
validateToken();
</script>
