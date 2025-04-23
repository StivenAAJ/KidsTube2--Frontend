<template>
  <div class="verify-email-container">
    <div v-if="loading" class="loading">
      Verificando email...
    </div>
    
    <div v-else-if="error" class="error">
      <h2>Error de Verificación</h2>
      <p>{{ error }}</p>
      <router-link to="/login" class="btn">Ir al inicio de sesión</router-link>
    </div>
    
    <div v-else class="success">
      <h2>¡Email Verificado!</h2>
      <p>Tu cuenta ha sido verificada exitosamente.</p>
      <router-link to="/login" class="btn">Ir al inicio de sesión</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { verifyEmail } from '../services/userFunctions';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const token = route.params.token;
    await verifyEmail(token);
    loading.value = false;
  } catch (err) {
    error.value = 'No se pudo verificar el email. Por favor, intenta nuevamente.';
    loading.value = false;
    console.error('Error en verificación:', err);
  }
});
</script>

<style scoped>
.verify-email-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading {
  color: #666;
}

.error {
  color: #dc2626;
}

.success {
  color: #059669;
}

.btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.btn:hover {
  background-color: #1d4ed8;
}
</style>
