<template>
  <div>
    <!-- Navbar -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo con icono -->
          <div class="flex items-center space-x-2">
            <h2 class="font-bold text-xl text-gray-800">KidsTube</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6 text-gray-800"
            >
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
              />
            </svg>
          </div>

          <!-- Navigation Links -->
          <div class="flex space-x-4">
            <router-link to="/" class="text-gray-700 hover:text-gray-900 font-medium">Inicio</router-link>
            <router-link v-if="!isAuthenticated" to="/register" class="text-gray-700 hover:text-gray-900 font-medium">Registro</router-link>
            <router-link v-if="!isAuthenticated" to="/login" class="text-gray-700 hover:text-gray-900 font-medium">Iniciar Sesión</router-link>
            
            <!-- Botón de cerrar sesión -->
            <button 
              v-if="isAuthenticated"
              @click="logout"
              class="text-red-600 hover:text-red-800 font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Router View -->
    <router-view></router-view>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-gray-500 text-sm">
          Copyright © 2025 - All right reserved by Stiven Arguello Jimenez
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      isAuthenticated: !!sessionStorage.getItem("token"), // Verificar si hay un token guardado
    };
  },
  methods: {
    logout() {
      sessionStorage.removeItem("token"); // Eliminar token
      sessionStorage.removeItem("userId"); // Eliminar ID del usuario padre
      this.isAuthenticated = false; // Actualizar estado de autenticación
      this.$router.push("/login"); // Redirigir al login
    },
    checkAuth() {
      this.isAuthenticated = !!sessionStorage.getItem("token");
    },
  },
  mounted() {
    window.addEventListener("storage", this.checkAuth); // Detecta cambios en localStorage
  },
  beforeUnmount() {
    window.removeEventListener("storage", this.checkAuth); // Limpia el evento
  },
};
</script>

<style scoped>
.router-link-active {
  color: #1a365d;
  font-weight: bold;
}
</style>

