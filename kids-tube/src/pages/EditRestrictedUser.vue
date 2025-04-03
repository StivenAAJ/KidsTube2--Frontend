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
  
  <script>
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  
  const avatarImages = import.meta.glob("/src/assets/avatars/*.png", { eager: true });
  
  export default {
    setup() {
      const route = useRoute();
      const router = useRouter();
      const user = ref({ fullName: "", pin: "", avatar: "" });
  
      const avatarList = Object.keys(avatarImages).map(path => path.split("/").pop());
  
      const getAvatarUrl = (avatar) => {
        return avatar ? avatarImages[`/src/assets/avatars/${avatar}`]?.default || "/src/assets/avatars/default.png" : "/src/assets/avatars/default.png";
      };
  
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:3000/restrictedUsers/${route.params.id}`);
          user.value = await response.json();
        } catch (error) {
          console.error("Error al obtener el usuario restringido:", error);
        }
      };
  
      const updateRestrictedUser = async () => {
        try {
          await fetch(`http://localhost:3000/restrictedUsers/${route.params.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user.value),
          });
          router.push("/dashboard");
        } catch (error) {
          console.error("Error al actualizar el usuario restringido:", error);
        }
      };

      const goBack = () => {
        window.history.back();
      };
  
      onMounted(fetchUser);
  
      return { user, updateRestrictedUser, avatarList, getAvatarUrl, goBack };
    },
  };
  </script>
  