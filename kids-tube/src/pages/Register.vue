<template>
    <div class="flex h-screen">
      <!-- Sección izquierda con imagen -->
      <div class="w-1/2 relative">
        <img src="/register-bg.jpeg" alt="Imagen de fondo" class="w-full h-full object-cover">
        <div class="absolute top-10 left-10 text-white">
        </div>
        <div class="absolute bottom-10 left-10 text-white text-lg font-semibold px-5">
          <p>Por favor, ingresa tus credenciales, así podremos crear tu cuenta</p>
        </div>
      </div>
  
      <!-- Sección derecha con el formulario -->
      <div class="w-1/2 bg-black-600 flex justify-center items-center">
        <div class="bg-gradient-to-r from-blue-800 to-pink-600 p-8 rounded-xl w-96">
          <h2 class="text-2xl text-white font-bold ">Registro</h2>
          
          <form @submit.prevent="register" class="space-y-4">
            <input 
              type="text" 
              v-model="first_name" 
              placeholder="Nombre" 
              class="w-full p-2 rounded-lg" 
              required 
            />
            
            <input 
              type="text" 
              v-model="last_name" 
              placeholder="Apellidos" 
              class="w-full p-2 rounded-lg" 
              required 
            />
            
            <input 
              type="date" 
              v-model="birthday" 
              placeholder="Fecha de nacimiento" 
              class="w-full p-2 rounded-lg" 
              required 
            />

            <!-- Campo de teléfono -->
            <div class="flex gap-2">
              <select 
                v-model="selectedCountry" 
                class="w-1/3 p-2 rounded-lg text-black"
                required
              >
                <option value="" disabled>País</option>
                <option 
                  v-for="country in countries" 
                  :key="country.code" 
                  :value="country"
                >
                  {{ country.flag }} +{{ country.dialCode }}
                </option>
              </select>
              
              <input 
                type="tel" 
                v-model="phoneNumber"
                placeholder="Número telefónico"
                class="w-2/3 p-2 rounded-lg text-black"
                required
              />
            </div>
            <span v-if="phoneError" class="text-red-500 text-xs">{{ phoneError }}</span>

            <input 
              type="password" 
              v-model="pin" 
              placeholder="Pin" 
              class="w-full p-2 rounded-lg" 
              maxlength="6" 
              required 
            />
            <p class="text-sm text-white-500">El pin se utiliza para que sus niños lo ingresen cuando entran a sus cuentas</p>
            
            <input 
              type="email" 
              v-model="email" 
              placeholder="Correo" 
              class="w-full p-2 rounded-lg" 
              required 
            />
            
            <input 
              type="password" 
              v-model="password" 
              placeholder="Contraseña" 
              class="w-full p-2 rounded-lg" 
              required 
            />
            
            <input 
              type="password" 
              v-model="confirm_password" 
              placeholder="Confirmar Contraseña" 
              class="w-full p-2 rounded-lg" 
              required 
            />

            <p class="text-xs text-white">
              Al crear una cuenta aceptas nuestros 
              <router-link to="/Terms" class="text-blue-300 underline">Términos</router-link>
            </p>
            
            <button 
              type="submit"
              class="w-full p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
              :disabled="isLoading"
              @click="register"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registrando...
              </span>
              <span v-else>Crear Cuenta</span>
            </button>
          </form>

        <!-- Botón de Google -->
        <div v-if="!isGoogleSignUp">
          <div id="g_id_onload"
               data-client_id="730564703117-rdjr6nq4g67tqkldk2rpvkf676ha0s1i.apps.googleusercontent.com"
               data-context="signup"
               data-ux_mode="popup"
               data-callback="handleGoogleSignUp">
          </div>
          <div class="g_id_signin" data-type="standard"></div>
        </div>

        <!-- Mensajes de error y éxito -->
        <div v-if="errorMessage" class="p-3 bg-red-100 text-red-700 rounded">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="p-3 bg-green-100 text-green-700 rounded">
          {{ successMessage }}
        </div>
        </div>
      </div>
    </div>
</template>
  
<script>
import { ref, computed } from 'vue';
import { createUser } from "../services/userFunctions";
import { parsePhoneNumber, isValidPhoneNumber, formatIncompletePhoneNumber } from 'libphonenumber-js';
import { GoogleLogin } from '@react-oauth/google';

export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      birthday: "",
      phoneNumber: "",
      phoneError: "",
      formattedPhone: "",
      pin: "",
      email: "",
      password: "",
      confirm_password: "",
      selectedCountry: null,
      countries: [],
      isLoading: false,
      successMessage: "",
      errorMessage: "",
      isValidPhone: false
    };
  },

  computed: {
    isFormValid() {
      return this.first_name && 
             this.last_name && 
             this.birthday && 
             this.isValidPhone && 
             this.pin && 
             this.email && 
             this.password && 
             this.confirm_password && 
             this.selectedCountry;
    }
  },
  
  methods: {
    async fetchCountriesWithPhoneCodes() {
      try {
        // Obtener datos de países
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();

        // Obtener códigos telefónicos desde otra API
        const phoneCodesResponse = await fetch("https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json");
        const phoneCodes = await phoneCodesResponse.json();

        // Combinar los datos
        this.countries = data.map(country => {
          const phoneCode = phoneCodes.find(pc => pc.code === country.cca2);
          return {
            name: country.name.common,
            code: country.cca2,
            flag: country.flag,
            dialCode: phoneCode ? phoneCode.dial_code.replace('+', '') : '',
          };
        }).filter(c => c.dialCode) // Solo países con código telefónico
          .sort((a, b) => a.name.localeCompare(b.name));

      } catch (error) {
        console.error("Error obteniendo datos de países:", error);
      }
    },

    validatePhone() {
      if (!this.phoneNumber) {
        this.phoneError = "El número telefónico es requerido";
        return false;
      }
      if (!this.selectedCountry) {
        this.phoneError = "Selecciona un país";
        return false;
      }
      // Validación básica: solo números
      if (!/^\d+$/.test(this.phoneNumber)) {
        this.phoneError = "Solo se permiten números";
        return false;
      }
      this.phoneError = "";
      return true;
    },

    async register() {
      try {
        console.log("Iniciando registro...");
        this.errorMessage = "";
        this.successMessage = "";
        this.isLoading = true;

        // Validaciones
        if (!this.validateForm()) {
          return;
        }

        const userData = {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          password: this.password,
          number: this.formatPhoneNumber(),
          pin: parseInt(this.pin),
          country: this.selectedCountry.name,
          birthday: this.birthday
        };

        console.log("Datos a enviar:", userData);

        const response = await createUser(userData);
        console.log("Respuesta del servidor:", response);

        if (response.token) {
          // Guardar el token
          sessionStorage.setItem('token', response.token);
          
          this.successMessage = "Registro exitoso. Redirigiendo...";
          
          // Esperar un momento antes de redirigir
          setTimeout(() => {
            this.$router.push('/verification-pending');
          }, 1500);
        } else {
          throw new Error("No se recibió el token de autenticación");
        }

      } catch (error) {
        console.error("Error en registro:", error);
        this.errorMessage = error.message || "Error al registrar usuario";
      } finally {
        this.isLoading = false;
      }
    },

    validateForm() {
      // Validar contraseñas
      if (this.password !== this.confirm_password) {
        this.errorMessage = "Las contraseñas no coinciden";
        return false;
      }

      // Validar teléfono
      if (!this.phoneNumber || !this.selectedCountry) {
        this.errorMessage = "El número telefónico y país son requeridos";
        return false;
      }

      // Validar PIN
      if (this.pin.length !== 6 || isNaN(this.pin)) {
        this.errorMessage = "El PIN debe ser de 6 dígitos";
        return false;
      }

      return true;
    },

    formatPhoneNumber() {
      return this.selectedCountry ? 
        `+${this.selectedCountry.dialCode}${this.phoneNumber}` : 
        this.phoneNumber;
    },

    clearForm() {
      this.first_name = "";
      this.last_name = "";
      this.birthday = "";
      this.phoneNumber = "";
      this.pin = "";
      this.email = "";
      this.password = "";
      this.confirm_password = "";
      this.selectedCountry = null;
      this.phoneError = "";
      this.formattedPhone = "";
      this.isValidPhone = false;
      this.errorMessage = "";
      this.successMessage = "";
    },

    async handleGoogleSignUp(response) {
      try {
        const token = response.credential; // Token JWT de Google
        console.log("Token de Google:", token);

        // Envía el token al backend para procesar el registro
        const res = await fetch("http://localhost:3000/auth/google-signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!res.ok) {
          throw new Error("Error al registrarse con Google");
        }

        const data = await res.json();
        console.log("Usuario registrado:", data);

        this.successMessage = "Registro exitoso con Google. Redirigiendo...";
        setTimeout(() => {
          window.location.href = "/dashboard"; // Redirige al usuario
        }, 1500);
      } catch (error) {
        console.error("Error en Google Sign-Up:", error);
        this.errorMessage = "Error al registrarse con Google";
      }
    },
    
    handleGoogleError() {
      console.error("Error al iniciar sesión con Google");
      this.errorMessage = "Error al iniciar sesión con Google";
    }
  },
  mounted() {
    this.fetchCountriesWithPhoneCodes();

    // Hacer disponible globalmente el callback de Google
    window.handleGoogleSignUp = this.handleGoogleSignUp;
  },
  validatePin() {
      this.pin = this.pin.replace(/\D/g, "").slice(0, 6);
  },
  watch: {
    phoneNumber() {
      this.validatePhone();
    },
    selectedCountry() {
      if (this.phoneNumber) {
        this.validatePhone();
      }
    },
    pin(newValue) {
      // Solo permitir números y máximo 6 dígitos
      this.pin = newValue.replace(/\D/g, '').slice(0, 6);
    }
  }
};
</script>

  
  <style scoped>
  /* Add your styles here */
  .country-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .flag {
    width: 1.5rem;
    height: 1rem;
    object-fit: cover;
  }
  .g_id_signin {
  display: block !important;
  margin-top: 1rem;
}

  </style>