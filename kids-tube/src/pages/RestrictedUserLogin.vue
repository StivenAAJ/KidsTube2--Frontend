<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black-500 to-red-500">
    <h1 class="text-4xl font-bold text-white mb-6">Selecciona tu perfil</h1>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
      <div
        v-for="profile in profiles"
        :key="profile._id"
        class="cursor-pointer p-4 rounded-2xl flex flex-col items-center hover:scale-105 transition relative"
        :class="{ 'selected-profile': selectedProfile && selectedProfile._id === profile._id }"
        @click="selectProfile(profile)"
      >
        <img :src="profile.avatar" :alt="profile.fullName" class="w-24 h-24 rounded-full transition-transform duration-300" />
        <p class="mt-2 font-semibold text-white">{{ profile.fullName }}</p>
      </div>
    </div>

    <!-- Cuadro para ingresar el PIN -->
    <div v-if="selectedProfile" class="mt-6 bg-white p-6 rounded-2xl shadow-lg text-center">
      <h2 class="text-2xl font-bold mb-4 text-black">Ingresa tu PIN</h2>
      <input
        type="password"
        v-model="pin"
        class="p-2 border rounded-lg text-center text-xl text-black "
        placeholder="****"
        maxlength="6"
        ref="pinInput"
      />
      <button
        @click="handleLogin"
        class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Entrar
      </button>
      <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    </div>

  <div v-if="showParentPinModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 class="text-2xl font-bold mb-4 text-black">Ingresa el PIN de la cuenta padre</h2>
      
      <input
        type="password"
        v-model="parentPin"
        class="p-2 border rounded-lg text-center text-xl text-black"
        placeholder="****"
        maxlength="6"
      />
      
      <div class="mt-4 flex justify-center gap-4">
        <button @click="validateParentPin" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          Confirmar
        </button>
        <button @click="showParentPinModal = false" class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Cancelar
        </button>
      </div>

      <p v-if="parentError" class="text-red-500 mt-2">{{ parentError }}</p>
    </div>
  </div>

    <button @click="showParentPinModal = true" class="mt-6 text-white underline">Ir al Dashboard</button>
  </div>
</template>

  
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTokenValidation } from '../composables/useTokenValidation';

const { validateToken } = useTokenValidation();
const router = useRouter();

// Importar las imágenes de los avatares
const avatarImages = import.meta.glob('/src/assets/avatars/*.png', { eager: true });

// Definir las variables
const profiles = ref([]);
const selectedProfile = ref(null);
const pin = ref('');
const error = ref('');
const restrictedUsers = ref([]);
const showParentPinModal = ref(false);
const parentPin = ref('');
const parentError = ref('');

// Función para obtener la URL del avatar
const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return '/src/assets/avatars/default.png';
  const fileName = avatarPath.split('/').pop();
  return avatarImages[`/src/assets/avatars/${fileName}`]?.default || '/src/assets/avatars/default.png';
};

const loadRestrictedUsers = async () => {
  if (!validateToken()) return;
  
  try {
    const parentId = localStorage.getItem('userId');
    if (!parentId) {
      error.value = 'No se encontró el ID del padre';
      return;
    }

    const response = await fetch(`http://localhost:3000/restrictedUsers/by-parent/${parentId}`);
    const data = await response.json();
    // Procesar los avatares antes de asignar los datos
    profiles.value = data.map(profile => ({
      ...profile,
      avatar: getAvatarUrl(profile.avatar)
    }));
    restrictedUsers.value = data;
  } catch (err) {
    error.value = 'Error al cargar usuarios';
    console.error('Error:', err);
  }
};

const selectProfile = (profile) => {
  selectedProfile.value = profile;
};

const handleLogin = async () => {
  if (!validateToken()) return;
  
  try {
    // Verificar que haya un perfil seleccionado y un PIN
    if (!selectedProfile.value || !pin.value) {
      error.value = 'Por favor, ingresa tu PIN';
      return;
    }

    const response = await fetch('http://localhost:3000/restrictedUsers/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pin: pin.value,
        profileId: selectedProfile.value._id // Incluir el ID del perfil seleccionado
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // Guardar los datos del usuario restringido
      sessionStorage.setItem('restrictedUser', JSON.stringify({
        ...selectedProfile.value,
        ...data.user
      }));
      router.push('/restricted-playlists');
    } else {
      error.value = 'PIN incorrecto';
    }
  } catch (err) {
    error.value = 'Error al iniciar sesión';
    console.error('Error:', err);
  }
};

const validateParentPin = async () => {
  if (!validateToken()) return;
  
  try {
    const parentAccount = localStorage.getItem("userId");
    console.log("ID recuperado:", parentAccount); // Para debugging
    
    if (!parentAccount || parentAccount === "undefined" || parentAccount === "null") {
      parentError.value = "No hay cuenta padre activa. Por favor, inicia sesión nuevamente.";
      router.push('/login'); // Redirigir al login si no hay userId válido
      return;
    }

    if (!parentPin.value) {
      parentError.value = "Por favor, ingresa el PIN";
      return;
    }

    console.log("Enviando request con:", { // Para debugging
      userId: parentAccount,
      pin: parentPin.value
    });

    const response = await fetch("http://localhost:3000/users/validate-pin", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}` // Añadir token si es necesario
      },
      body: JSON.stringify({ 
        userId: parentAccount, 
        pin: parentPin.value
      })
    });

    if (!response.ok) {
      const result = await response.json();
      console.error("Error response:", result); // Para debugging
      parentError.value = result.error || "Error al validar el PIN";
      return;
    }

    const result = await response.json();
    console.log("Respuesta exitosa:", result); // Para debugging
    showParentPinModal.value = false;
    router.push("/dashboard");
  } catch (error) {
    console.error("Error completo:", error);
    parentError.value = "Error al validar el PIN. Por favor, intenta nuevamente.";
  }
};

onMounted(async () => {
  if (validateToken()) {
    await loadRestrictedUsers();
  }
});
</script>

<style scoped>
.selected-profile {
  border: 4px solid white;
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
  transition: transform 0.3s ease, background-color 0.3s ease;
}
</style>