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
          
          <input type="text" placeholder="Nombre" v-model="first_name" class="w-full p-2 mt-4 rounded-lg" />
          <input type="text" placeholder="Apellidos" v-model="last_name" class="w-full p-2 mt-4 rounded-lg" />
          <input type="date" placeholder="Fecha de nacimiento" v-model="birthday" class="w-full p-2 mt-4 rounded-lg" />
          <input type="text" placeholder="Número Telefónico" v-model="phone" class="w-full p-2 mt-4 rounded-lg" />
          <input type="password" placeholder="Pin" v-model="pin" class="w-full p-2 mt-4 rounded-lg" maxlength="6" />
          <p class="text-sm text-white-500 mt-1">El pin se utiliza para que sus niños lo ingresen cuando entran a sus cuentas</p>
          <input type="email" placeholder="Correo" v-model="email" class="w-full p-2 mt-4 rounded-lg" />
          <input type="password" placeholder="Contraseña" v-model="password" class="w-full p-2 mt-4 rounded-lg" />
          <input type="password" placeholder="Confirmar Contraseña" v-model="confirm_password" class="w-full p-2 mt-4 rounded-lg" />

          <!-- Selector de países -->
          <select v-model="selectedCountry" class=" text-black w-full p-2 mt-4 rounded-lg">
          <option value="" disabled>Selecciona un país</option>
          <option v-for="country in countries" :key="country.code" :value="country.name">
            {{ country.name }}
          </option>
        </select>

  
          <p class="text-xs text-white mt-2">
            Al crear una cuenta aceptas nuestros 
            <router-link to="/Terms" class=" text-blue-300 underline">Términos</router-link>
          </p>
          
          <button @click="register" class="w-full mt-4 p-2 bg-blue-400 text-white rounded-lg">Crear Cuenta</button>
        </div>
      </div>
    </div>
</template>
  
<script>
import { createUser } from "../services/userFunctions";
export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      birthday: "",
      phone: "",
      pin : "",
      email: "",
      password: "",
      confirm_password: "",
      selectedCountry: "",
      countries: [], // Lista de países
    };
  },
  
  methods: {
    
    async register() {
        if (this.password !== this.confirm_password) {
          alert("Las contraseñas no coinciden");
          return;
        }

        const userData = {
          first_name: this.first_name,
          last_name: this.last_name,
          birthday: this.birthday,
          number: this.phone,
          pin: this.pin,
          email: this.email,
          password: this.password,
          country: this.selectedCountry,
        };

        try {
          const newUser = await createUser(userData);
          console.log("Usuario registrado:", newUser);
          alert("Registro exitoso");
          this.$router.push("/Login"); // Redirigir tras registro exitoso
        } catch (error) {
          alert("Error al registrar usuario");
        }
    },  
    
    async fetchCountries() {
      console.log("Llamando a la API de países...");
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        
        if (!response.ok) {
          throw new Error(`Error en la respuesta de la API: ${response.status}`);
        }

        const data = await response.json();
        console.log("Datos recibidos:", data); // Verifica si llegan los datos

        this.countries = data
          .map(country => ({
            name: country.name?.common || "Desconocido",
            code: country.cca2 || country.cca3 || ""
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        console.log("Lista de países procesada:", this.countries);
      } catch (error) {
        console.error("Error obteniendo países:", error);
      }
    },
  },
  mounted() {
    this.fetchCountries(); // Llamamos a la API cuando el componente se monta
  },
  validatePin() {
      this.pin = this.pin.replace(/\D/g, "").slice(0, 6);
  },
};
</script>

  
  <style scoped>
  /* Add your styles here */
  </style>