<template>
  <div class="p-6 bg-gradient-to-br from-blue-500 to-green-500">
    <h1 class="text-2xl font-bold mb-4">Tus Playlists</h1>
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <div v-if="playlists.length === 0">No tienes playlists asignadas.</div>
      <div v-for="playlist in playlists" :key="playlist._id" 
           class="border p-4 rounded mb-2 cursor-pointer hover:bg-gradient-to-br from-yellow-500 to-red-600"
           @click="selectPlaylist(playlist)">
        <h2 class="text-lg font-bold">{{ playlist.name }}</h2>
        <ul>
          <li v-for="video in playlist.videos" :key="video._id">{{ video.title }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { GET_PLAYLISTS_BY_PROFILE } from '../graphQL/queries';
import { useTokenValidation } from '../composables/useTokenValidation';

const { validateToken } = useTokenValidation();
const router = useRouter();

// Obtener el ID del usuario restringido
const user = JSON.parse(sessionStorage.getItem('restrictedUser'));

// Usar la query de GraphQL
const { result, loading, error } = useQuery(
  GET_PLAYLISTS_BY_PROFILE,
  { profileId: user?._id },
  { enabled: !!user?._id }
);

// Computar las playlists del resultado
const playlists = computed(() => result.value?.playlistsByProfile ?? []);

const selectPlaylist = (playlist) => {
  if (!validateToken()) return;
  
  try {
    sessionStorage.setItem('currentPlaylist', JSON.stringify(playlist));
    router.push(`/restricted-player/${playlist._id}`);
  } catch (err) {
    console.error("Error al seleccionar playlist", err);
  }
};

onMounted(() => {
  validateToken();
});
</script>
