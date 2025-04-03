<template>
    <div class="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      <!-- Hero Section -->
      <section class="text-center py-20">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-5xl font-bold text-gray-800 mb-6">
            Bienvenido a <span class="text-blue-600">KidsTube</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            La plataforma de videos educativos y entretenimiento seguro para niños.
          </p>
          <div class="space-x-4">
            <router-link
              to="/videos"
              class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Explorar Videos
            </router-link>
            <router-link
              to="/register"
              class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
            >
              Registrarse
            </router-link>
          </div>
        </div>
      </section>
  
      <!-- Features Section -->
      <section class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-4">
          <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
            ¿Por qué elegir KidsTube?
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="text-center">
              <div class="bg-blue-100 p-6 rounded-full inline-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mt-6">
                Contenido Seguro
              </h3>
              <p class="text-gray-600 mt-2">
                Todos los vídeos son elegidos por los padres, para asegurar una experiencia sana y divertida!.
              </p>
            </div>
            <!-- Feature 2 -->
            <div class="text-center">
              <div class="bg-purple-100 p-6 rounded-full inline-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mt-6">
                Aprendizaje Divertido
              </h3>
              <p class="text-gray-600 mt-2">
                Videos educativos que hacen que el aprendizaje sea divertido y emocionante.
              </p>
            </div>
            <!-- Feature 3 -->
            <div class="text-center">
              <div class="bg-blue-100 p-6 rounded-full inline-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-12 w-12 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mt-6">
                Disponible 24/7
              </h3>
              <p class="text-gray-600 mt-2">
                Accede a nuestros videos en cualquier momento y desde cualquier lugar.
              </p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Call to Action Section -->
      <section class="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-white mb-6">
            ¡Empieza a explorar hoy mismo!
          </h2>
          <p class="text-xl text-blue-100 mb-8">
            Regístrate ahora y descubre un mundo de videos educativos y entretenimiento seguro para tus hijos.
          </p>
          <router-link
            to="/register"
            class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
          >
            Registrarse Gratis
          </router-link>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomePage',
  };
  </script>
  
  <style scoped>
  /* Estilos personalizados si es necesario */
  </style>
  