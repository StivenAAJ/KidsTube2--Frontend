<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Verificación Pendiente</h2>
        <div class="mb-6">
          <svg class="mx-auto h-16 w-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        
        <p class="text-gray-600 mb-4">
          Tu cuenta está pendiente de verificación. Por favor, revisa tu correo electrónico y sigue las instrucciones para verificar tu cuenta.
        </p>
        
        <p class="text-sm text-gray-500 mb-6">
          No podrás acceder a las funciones completas hasta que verifiques tu cuenta.
        </p>

        <div class="space-y-4">
          <button 
            @click="resendVerification" 
            class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            :disabled="isResending"
          >
            {{ isResending ? 'Enviando...' : 'Reenviar correo de verificación' }}
          </button>
          
          <button 
            @click="logout" 
            class="w-full p-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const isResending = ref(false);

    const resendVerification = async () => {
      isResending.value = true;
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://localhost:3000/users/resend-verification', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al reenviar el correo');
        
        alert('Correo de verificación reenviado. Por favor, revisa tu bandeja de entrada.');
      } catch (error) {
        console.error('Error:', error);
        alert('Error al reenviar el correo de verificación');
      } finally {
        isResending.value = false;
      }
    };

    const logout = () => {
      sessionStorage.removeItem('token');
      router.push('/login');
    };

    return {
      isResending,
      resendVerification,
      logout
    };
  }
};
</script>
