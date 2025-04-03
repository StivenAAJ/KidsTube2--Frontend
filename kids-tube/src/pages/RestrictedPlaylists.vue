<template>
  <div class="p-6 bg-gradient-to-br from-blue-500 to-green-500">
    <h1 class="text-2xl font-bold mb-4">Tus Playlists</h1>
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const playlists = ref([]);
const router = useRouter();

const fetchPlaylists = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("restrictedUser"));
    if (!user) return;

    const response = await fetch(`http://localhost:3000/playlists/by-profile?profileId=${user._id}`);
    const data = await response.json();
    
    playlists.value = data;
  } catch (error) {
    console.error("Error al obtener las playlists", error);
  }
};

const selectPlaylist = (playlist) => {
  router.push({ path: `/restricted-player/${playlist._id}` });
};

onMounted(fetchPlaylists);
</script>
