<template>
    <div class="container mx-auto p-6">
        <div class="bg-white shadow-md rounded-lg p-6">
            <h1 class="text-3xl text-black font-bold mb-4">Términos y Condiciones</h1>
            <p class="mb-4 text-black">
                Bienvenido a KidsTube. Al utilizar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones. Por favor, léelos cuidadosamente.
            </p>
            <h2 class="text-2xl text-black font-semibold mb-2">1. Uso del Sitio</h2>
            <p class="mb-4 text-black">
                El contenido de este sitio es solo para uso personal y no comercial. No puedes copiar, distribuir o modificar ningún contenido sin nuestro permiso.
            </p>
            <h2 class="text-2xl text-black font-semibold mb-2">2. Propiedad Intelectual</h2>
            <p class="mb-4 text-black">
                Todos los derechos de propiedad intelectual del contenido de este sitio web son propiedad de KidsTube o de sus licenciantes.
            </p>
            <h2 class="text-2xl text-black font-semibold mb-2">3. Limitación de Responsabilidad</h2>
            <p class="mb-4 text-black" >
                KidsTube no será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de uso de nuestro sitio.
            </p>
            <h2 class="text-2xl text-black font-semibold mb-2">4. Cambios en los Términos</h2>
            <p class="mb-4 text-black">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cualquier cambio publicando los nuevos términos en nuestro sitio web.
            </p>
            <router-link
            to="/register"
            class="bg-blue text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
          >
            Volver
          </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Terms',
};
</script>

<style scoped>
.container {
    max-width: 64rem; /* 4xl in Tailwind CSS */
}
</style>