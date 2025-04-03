<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-300">
      <div class="bg-white p-8 rounded-lg shadow-md w-[500px]">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">Agregar Usuario Restringido</h2>
  
        <!-- Nombre Completo -->
        <label class="block text-gray-700 font-medium">Nombre Completo *</label>
        <input v-model="name" type="text" class="w-full p-3 border rounded mb-4 text-black" placeholder="Ingrese el nombre completo" />
  
        <!-- PIN -->
        <label class="block text-gray-700 font-medium">PIN (6 dígitos) *</label>
        <input v-model="pin" type="password" maxlength="6" class="w-full p-3 border rounded mb-4 text-black" placeholder="******" />
  
        <!-- Avatares -->
        <label class="block text-gray-700 font-medium mb-2">Selecciona un Avatar *</label>
        <div class="flex justify-center space-x-4 mb-6">
          <div 
            v-for="avatar in avatars" 
            :key="avatar.name" 
            @click="selectedAvatar = avatar.src"
            class="w-20 h-20 border-2 rounded-full cursor-pointer transition-all flex items-center justify-center"
            :class="selectedAvatar === avatar.src ? 'border-blue-500 scale-110' : 'border-gray-300'"
          >
            <img :src="avatar.src" :alt="avatar.name" class="w-full h-full rounded-full object-cover" />
          </div>
        </div>
  
        <!-- Botón de Guardar -->
        <button 
        @click="createRestrictedUser" 
        class="w-full bg-blue-500 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
      >
        Guardar Usuario
      </button>
      <button 
        @click="goBack" 
        class="w-full bg-blue-500 text-white p-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition mt-4"
      >
        Volver
      </button>

      </div>
    </div>
  </template>
  
  <script setup>
import { ref } from "vue";

const name = ref("");
const pin = ref("");
const selectedAvatar = ref("");
const parentId = "67c60f5a503fe95e104a8075"; // Asegúrate de obtenerlo correctamente

const avatars = ref([
  { name: "Avatar 1", src: new URL("../assets/avatars/1.png", import.meta.url).href },
  { name: "Avatar 2", src: new URL("../assets/avatars/2.png", import.meta.url).href },
  { name: "Avatar 3", src: new URL("../assets/avatars/3.png", import.meta.url).href },
  { name: "Avatar 4", src: new URL("../assets/avatars/4.png", import.meta.url).href },
  { name: "Avatar 5", src: new URL("../assets/avatars/5.png", import.meta.url).href },
  { name: "Avatar 6", src: new URL("../assets/avatars/6.png", import.meta.url).href },
]);

const createRestrictedUser = async () => {
  if (!name.value || !pin.value || !selectedAvatar.value) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  // Extraer solo el nombre del archivo del avatar
  const selectedAvatarName = selectedAvatar.value.split("/").pop();

  try {
    const response = await fetch("http://localhost:3000/restrictedUsers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: name.value,  // El backend espera "fullName" en vez de "name"
        pin: pin.value,
        avatar: selectedAvatarName, // Solo el nombre del archivo
        parentAccount: parentId, // Asegurar que se envía correctamente
      }),
    });

    if (response.ok) {
      alert("Usuario agregado con éxito");
      name.value = "";
      pin.value = "";
      selectedAvatar.value = "";
      window.location.href = "/dashboard";
    } else {
      const errorData = await response.json();
      alert("Error al agregar usuario: " + errorData.error);
    }
  } catch (error) {
    console.error("Error en el servidor:", error);
    alert("Hubo un problema al conectar con el servidor.");
  }
};
const goBack = () => {
        window.history.back();
    };
</script>

  
  <style scoped>
  /* Opcional: Ajustes visuales */
  </style>
  
  