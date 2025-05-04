<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-red-300">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Agregar Video</h2>

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

      <!-- Videos seleccionados -->
      <div v-if="selectedVideos.length > 0" class="mb-4">
        <h3 class="text-gray-700 font-bold mb-2">Seleccionados:</h3>
        <ul class="space-y-2">
          <li
            v-for="video in selectedVideos"
            :key="video._id"
            class="flex items-center space-x-2 p-2 border rounded"
          >
            <img :src="video.thumbnail" alt="Thumbnail" class="w-16 h-16 rounded" />
            <div>
              <p class="text-sm font-bold">{{ video.title }}</p>
              <p class="text-xs text-gray-500">{{ video.description }}</p>
            </div>
            <button
              @click="removeVideo(video._id)"
              class="text-red-500 hover:underline text-xs ml-auto"
            >
              Quitar
            </button>
          </li>
        </ul>
      </div>

      <!-- Botón para guardar -->
      <button
        @click="saveVideos"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Guardar Videos
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { youtubeService } from '../services/youtubeService'
import { useRouter } from 'vue-router'

const searchQuery = ref('')
const searchResults = ref([])
const selectedVideos = ref([])
const router = useRouter()

const searchVideos = async () => {
  try {
    searchResults.value = await youtubeService.searchVideos(searchQuery.value)
  } catch (error) {
    console.error('Error buscando videos:', error)
    alert('Hubo un error al buscar los videos.')
  }
}

const selectVideo = (video) => {
  if (!selectedVideos.value.find((v) => v._id === video._id)) {
    selectedVideos.value.push(video)
  }
}

const removeVideo = (videoId) => {
  selectedVideos.value = selectedVideos.value.filter((v) => v._id !== videoId)
}

const saveVideos = async () => {
  try {
    for (const video of selectedVideos.value) {
      const response = await fetch('http://localhost:3000/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(video),
      })
      if (!response.ok) {
        throw new Error('Error al guardar el video.')
      }
    }
    alert('Videos guardados exitosamente.')
    router.push('/dashboard')
  } catch (error) {
    console.error('Error guardando videos:', error)
    alert('Hubo un error al guardar los videos.')
  }
}
</script>
