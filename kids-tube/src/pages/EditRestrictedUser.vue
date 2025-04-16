<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-l from-blue-600 to-red-800">
      <div class="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 class="text-xl font-bold mb-4 text-black">Editar Usuario Restringido</h2>
  
        <form @submit.prevent="updateRestrictedUser">
          <label class="block mb-2 text-black">Nombre Completo:</label>
          <input v-model="user.fullName" type="text" class="w-full p-2 border rounded mb-4 text-black" />
  
          <label class="block mb-2 text-black">PIN (6 dígitos):</label>
          <input v-model="user.pin" type="password" class="w-full p-2 border rounded mb-4 text-black" minlength="6" maxlength="6" />
  
          <label class="block mb-2">Seleccionar Avatar:</label>
          <div class="flex space-x-2 overflow-x-auto">
            <img 
              v-for="avatar in avatarList" 
              :key="avatar" 
              :src="getAvatarUrl(avatar)" 
              @click="user.avatar = avatar" 
              :class="{'border-4 border-blue-500': user.avatar === avatar}" 
              class="w-14 h-14 rounded-full cursor-pointer hover:opacity-80 transition"
            />
          </div>
  
          <button type="submit" class="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600">
            Guardar Cambios
          </button>
          <button type="button" @click="goBack()" class="w-full bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600">
            Volver
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useTokenValidation } from '../composables/useTokenValidation';
  
  const { validateToken } = useTokenValidation();
  const route = useRoute();
  const router = useRouter();
  const user = ref({ fullName: "", pin: "", avatar: "" });
  
  const avatarImages = import.meta.glob("/src/assets/avatars/*.png", { eager: true });
  
  const avatarList = Object.keys(avatarImages).map(path => path.split("/").pop());
  
  const getAvatarUrl = (avatar) => {
    return avatar ? avatarImages[`/src/assets/avatars/${avatar}`]?.default || "/src/assets/avatars/default.png" : "/src/assets/avatars/default.png";
  };
  
  const loadUser = async () => {
    try {
      const response = await fetch(`http://localhost:3000/restrictedUsers/${route.params.id}`);
      const data = await response.json();
      user.value = data;
    } catch (err) {
      console.error("Error al obtener el usuario restringido:", err);
    }
  };
  
  const updateRestrictedUser = async () => {
    if (!validateToken()) return;
    
    try {
      const response = await fetch(`http://localhost:3000/restrictedUsers/${route.params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user.value),
      });
      if (response.ok) {
        router.push("/dashboard");
      } else {
        console.error("Error al actualizar el usuario restringido:", await response.json());
      }
    } catch (err) {
      console.error("Error al actualizar el usuario restringido:", err);
    }
  };

  const goBack = () => {
    window.history.back();
  };
  
  onMounted(async () => {
    if (validateToken()) {
      await loadUser();
    }
  });
  </script>
  