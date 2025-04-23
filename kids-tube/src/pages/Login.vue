<template>
    <div class="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center bg-gradient-to-r from-blue-200 to-purple-200">
      <!-- Login Card -->
      <div class="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <!-- Logo y Título -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center space-x-2">
            <!-- Icono de KidsTube -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <h1 class="text-3xl font-bold text-gray-800">KidsTube</h1>
          </div>
          <p class="text-gray-600 mt-2">Inicia sesión para acceder a tu cuenta.</p>
        </div>
  
        <!-- Formulario de Login -->
        <form v-if="!showSmsVerification" @submit.prevent="handleLogin">
          <!-- Campo de Email -->
          <div class="mb-6">
            <label for="email" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Ingresa tu correo electrónico"
              class="text-black mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gradient-to-r from-red-50 to-purple-50"
              required
            />
          </div>
  
          <!-- Campo de Contraseña -->
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Ingresa tu contraseña"
              class="text-black mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
  
          <!-- Botón de Iniciar Sesión -->
          <button
            type="submit"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
  
          <!-- Enlace de Registro -->
          <div class="mt-6 text-center">
            <p class="text-gray-600">
              ¿No tienes una cuenta?
              <router-link to="/register" class="text-blue-600 hover:underline">Regístrate</router-link>
            </p>
          </div>
        </form>

        <!-- Formulario de Verificación SMS -->
        <form v-else @submit.prevent="verifySmsCode" class="space-y-6">
          <div class="text-center">
            <h2 class="text-xl font-semibold text-gray-800 mb-2">Verificación en dos pasos</h2>
            <p class="text-gray-600">Hemos enviado un código por SMS a tu teléfono</p>
          </div>

          <div>
            <label for="smsCode" class="block text-sm font-medium text-gray-700">Código de verificación</label>
            <input
              type="text"
              id="smsCode"
              v-model="smsCode"
              placeholder="Ingresa el código de 6 dígitos"
              class="text-black mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg"
              maxlength="6"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
            :disabled="isVerifying"
          >
            {{ isVerifying ? 'Verificando...' : 'Verificar código' }}
          </button>

          <button
            type="button"
            @click="resendCode"
            class="w-full text-blue-600 px-4 py-2 rounded-lg font-semibold hover:text-blue-700"
            :disabled="isResending"
          >
            {{ isResending ? 'Enviando...' : 'Reenviar código' }}
          </button>
        </form>

        <!-- Mensajes de error -->
        <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {{ error }}
        </div>
      </div>
    </div>
</template>

<script>
import { loginUser, verifySmsCode, resendVerificationCode } from "../services/userFunctions";

export default {
  data() {
    return {
      email: "",
      password: "",
      smsCode: "",
      showSmsVerification: false,
      isLoading: false,
      isVerifying: false,
      isResending: false,
      error: "",
      tempToken: "",
      tempUserId: ""
    };
  },
  methods: {
    async handleLogin() {
      try {
        this.isLoading = true;
        this.error = "";
        
        const response = await loginUser(this.email, this.password);
        console.log("Respuesta login inicial:", response);
        
        if (response.requiresSmsVerification) {
          this.tempToken = response.tempToken;
          this.tempUserId = response.userId;
          console.log("Guardando ID temporal:", this.tempUserId);
          this.showSmsVerification = true;
        } else {
          sessionStorage.setItem("token", response.token);
          localStorage.setItem("userId", response.userId);
          this.$router.push("/restricted-user-login");
        }
      } catch (error) {
        this.error = error.message;
        console.error("Error en login:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async verifySmsCode() {
      try {
        this.isVerifying = true;
        this.error = "";
        
        console.log("Iniciando verificación con:", {
          code: this.smsCode,
          tempToken: this.tempToken,
          tempUserId: this.tempUserId
        });

        const response = await verifySmsCode(this.smsCode, this.tempToken);
        
        console.log("Respuesta verificación:", response);

        sessionStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.userId);

        console.log("ID guardado:", localStorage.getItem("userId"));

        this.$router.push("/restricted-user-login");
      } catch (error) {
        this.error = error.message;
        console.error("Error en verificación:", error);
      } finally {
        this.isVerifying = false;
      }
    },

    async resendCode() {
      try {
        this.isResending = true;
        this.error = "";
        
        const response = await loginUser(this.email, this.password);
        
        if (response.tempToken) {
          this.tempToken = response.tempToken;
        }
        if (response.userId) {
          this.tempUserId = response.userId;
        }
        
        this.error = "Nuevo código enviado";
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isResending = false;
      }
    }
  }
};
</script>