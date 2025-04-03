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
        <img :src="profile.avatar" alt="Avatar" class="w-24 h-24 rounded-full transition-transform duration-300" />
        <p class="mt-2 font-semibold">{{ profile.fullName }}</p>
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
        @click="login"
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

  
  <script>

  const avatarImages = import.meta.glob("/src/assets/avatars/*.png", { eager: true });

  export default {
  data() {
    return {
      profiles: [],
      selectedProfile: null,
      pin: "",
      error: "",
      showParentPinModal: false,  
      parentPin: "",  
      parentError: "El Pin ingresado no es correcto", 
    };
  },
  methods: {

    selectProfile(profile) {
      this.selectedProfile = profile;
      this.pin = "";
      this.error = "";
      

      // Enfocar el campo de PIN después de un pequeño retraso
      this.$nextTick(() => {
        this.$refs.pinInput.focus();
      });
    },

    async fetchProfiles() {
      try {
        const parentAccount = localStorage.getItem("userId"); // Obtener ID del padre
        if (!parentAccount) {
          console.error("No hay cuenta padre activa.");
          return;
        }

        const response = await fetch(`http://localhost:3000/restrictedUsers/by-parent/${parentAccount}`);

        if (!response.ok) {
          console.error("Error en la respuesta del servidor:", response.statusText);
          return;
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No hay perfiles disponibles para esta cuenta.");
          this.profiles = [];
          return;
        }

        this.profiles = data.map(profile => ({
          ...profile,
          avatar: avatarImages[`/src/assets/avatars/${profile.avatar}`]?.default || "/src/assets/avatars/default.png"
        }));
      } catch (error) {
        console.error("Error al obtener perfiles", error);
      }
    },

    selectProfile(profile) {
      this.selectedProfile = profile;
      this.pin = "";
      this.error = "";
    },
    async login() {
        if (!this.pin) {
        this.error = "Debes ingresar tu PIN";
        return;
      }
      try {
        const response = await fetch("http://localhost:3000/restrictedUsers/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileId: this.selectedProfile._id, pin: this.pin })
        });
        const result = await response.json();
        if (response.ok) {
          localStorage.setItem("restrictedUser", JSON.stringify({ _id: this.selectedProfile._id })); // Guardar ID del usuario restringido
          this.$router.push("/restricted-playlists");
        } else {
          this.error = result.error;
        }
      } catch (error) {
        this.error = "Error al intentar iniciar sesión";
      }
    },
  async validateParentPin() {
    try {
      const parentAccount = localStorage.getItem("userId"); 
      if (!parentAccount) {
        this.parentError = "No hay cuenta padre activa.";
        return;
      }

      const response = await fetch("http://localhost:3000/users/validate-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parentAccount, pin: this.parentPin })
      });

      const result = await response.json();

      if (response.ok) {
        this.showParentPinModal = false; // Cierra el modal
        this.$router.push("/dashboard"); // Redirige al dashboard
      } else {
        this.parentError = result.error; // Muestra el error en pantalla
      }
    } catch (error) {
      this.parentError = "Error al validar el PIN";
    }
  },
},
  mounted() {
    this.fetchProfiles();
  },
};
</script>

<style scoped>
.selected-profile {
  border: 4px solid white;
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
  transition: transform 0.3s ease, background-color 0.3s ease;
}
</style>