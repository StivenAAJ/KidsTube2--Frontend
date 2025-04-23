<template>
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-300">
      <div v-if="loading" class="text-center">
        <p>Cargando playlist...</p>
      </div>

      <div v-else-if="error" class="text-center text-red-600">
        <p>{{ error }}</p>
        <button @click="goBack" class="mt-4 bg-gray-500 text-white px-4 py-2 rounded">
          Volver
        </button>
      </div>

      <div v-else class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Editar Playlist</h2>
  
        <form @submit.prevent="handleSubmit">
          <!-- Nombre de la Playlist -->
          <label class="block text-gray-700">Nombre de la Playlist</label>
          <input 
            v-model="name" 
            type="text" 
            class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black mb-4" 
          />
  
          <!-- Selección de Perfiles -->
          <label class="block text-gray-700">Perfiles Asociados</label>
          <div v-for="profile in restrictedUsers" :key="profile._id" class="flex items-center mb-2 text-black">
            <input 
              type="checkbox" 
              :value="profile._id" 
              v-model="selectedProfiles" 
              class="mr-2 text-black" 
            />
            <span>{{ profile.fullName }}</span>
          </div>
  
          <!-- Selección de Videos -->
          <label class="block text-gray-700">Videos en la Playlist</label>
          <div v-for="video in videos" :key="video._id" class="flex items-center mb-2 text-black">
            <input 
              type="checkbox" 
              :value="video._id" 
              v-model="selectedVideos" 
              class="mr-2 text-black" 
            />
            <span>{{ video.title }}</span>
          </div>
  
          <div class="flex justify-between mt-4">
            <button 
              type="submit" 
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              :disabled="loading"
            >
              {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
            <button 
              type="button" 
              @click="goBack" 
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useTokenValidation } from '../composables/useTokenValidation';

  const { validateToken } = useTokenValidation();
  const router = useRouter();
  const route = useRoute();
  
  const name = ref('');
  const selectedVideos = ref([]);
  const selectedProfiles = ref([]);
  const videos = ref([]);
  const restrictedUsers = ref([]);
  const error = ref('');
  const loading = ref(false);
  
  const loadData = async () => {
    try {
      loading.value = true;
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            query LoadPlaylistData($id: ID!) {
              playlist(id: $id) {
                _id
                name
                videos {
                  _id
                  title
                  videoUrl
                  description
                }
                profiles {
                  _id
                  fullName
                  pin
                  avatar
                }
              }
              videos {
                _id
                title
                videoUrl
                description
              }
              restrictedUsers {
                _id
                fullName
                pin
                avatar
              }
            }
          `,
          variables: {
            id: route.params.id
          }
        })
      });

      const { data, errors } = await response.json();

      if (errors) {
        console.error('GraphQL Errors:', errors);
        throw new Error(errors[0].message);
      }

      if (!data || !data.playlist) {
        throw new Error('No se encontró la playlist');
      }

      console.log('Datos cargados:', data);

      name.value = data.playlist.name;
      videos.value = data.videos || [];
      restrictedUsers.value = data.restrictedUsers || [];
      selectedVideos.value = data.playlist.videos.map(v => v._id);
      selectedProfiles.value = data.playlist.profiles.map(p => p._id);

    } catch (err) {
      console.error('Error detallado:', err);
      error.value = err.message || 'Error al cargar datos';
    } finally {
      loading.value = false;
    }
  };
  
  const handleSubmit = async () => {
    if (!validateToken()) return;
    
    try {
      loading.value = true;
      const token = sessionStorage.getItem('token');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('Enviando actualización:', {
        id: route.params.id,
        name: name.value,
        videos: selectedVideos.value,
        profiles: selectedProfiles.value
      });

      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation UpdatePlaylist(
              $id: ID!,
              $name: String!,
              $videos: [ID!]!,
              $profiles: [ID!]!
            ) {
              updatePlaylist(
                id: $id,
                name: $name,
                videos: $videos,
                profiles: $profiles
              ) {
                _id
                name
                videos {
                  _id
                  title
                }
                profiles {
                  _id
                  fullName
                }
              }
            }
          `,
          variables: {
            id: route.params.id,
            name: name.value,
            videos: selectedVideos.value,
            profiles: selectedProfiles.value
          }
        })
      });

      const { data, errors } = await response.json();

      if (errors) {
        console.error('GraphQL Errors:', errors);
        throw new Error(errors[0].message);
      }

      if (!data || !data.updatePlaylist) {
        throw new Error('Error al actualizar la playlist');
      }

      console.log('Playlist actualizada exitosamente:', data.updatePlaylist);
      router.push('/dashboard');
    } catch (err) {
      console.error('Error en actualización:', err);
      error.value = err.message || 'Error al actualizar la playlist';
    } finally {
      loading.value = false;
    }
  };
  
  const goBack = () => {
    router.push('/dashboard');
  };
  
  onMounted(async () => {
    if (!validateToken()) {
      router.push('/login');
      return;
    }
    await loadData();
  });
  </script>
  