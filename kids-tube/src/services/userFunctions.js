const API_URL = "http://localhost:3000/users"; // URL de la API

export async function createUser(userData) {
  try {
    console.log("1. Iniciando creación de usuario");
    console.log("2. Datos a enviar:", userData);

    const response = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    console.log("3. Respuesta recibida, status:", response.status);
    const data = await response.json();
    console.log("4. Datos de respuesta:", data);

    if (!response.ok) {
      console.error("5. Error en la respuesta:", data);
      throw new Error(data.error || data.details || "Error al registrar el usuario");
    }

    console.log("6. Usuario creado exitosamente");
    return data;
  } catch (error) {
    console.error("7. Error en createUser:", error);
    throw error;
  }
}

export const loginUser = async (email, password) => {
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log("Respuesta login:", data);

    if (!response.ok) {
      throw new Error(data.error || "Error en el login");
    }

    // Verificar que tengamos el userId
    if (!data.userId) {
      console.error("No se recibió userId del servidor");
    }

    return {
      requiresSmsVerification: data.requiresSmsVerification,
      tempToken: data.tempToken,
      userId: data.userId // Debería venir del backend ahora
    };
  } catch (error) {
    console.error("Error en loginUser:", error);
    throw error;
  }
};

export const verifyEmail = async (token) => {
  try {
    console.log('Token a verificar:', token); // Para debugging

    const response = await fetch(`http://localhost:3000/users/verify-email/${token}`, {
      method: 'POST', // Asegúrate de que sea POST
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error de verificación: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en verifyEmail:', error);
    throw error;
  }
};

export const verifySmsCode = async (code, tempToken) => {
  try {
    console.log("Enviando verificación:", { code, tempToken });

    const response = await fetch("http://localhost:3000/users/verify-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, tempToken })
    });

    const data = await response.json();
    console.log("Respuesta verificación:", data);

    if (!response.ok) {
      throw new Error(data.error || "Error en la verificación");
    }

    if (!data.userId) {
      console.error("No se recibió userId en la verificación");
    }

    return {
      token: data.token,
      userId: data.userId
    };
  } catch (error) {
    console.error("Error en verifySmsCode:", error);
    throw error;
  }
};

export async function resendVerificationCode(email, password) {
  try {
    return await loginUser(email, password); // Esto generará un nuevo código
  } catch (error) {
    console.error('Error al reenviar código:', error);
    throw error;
  }
}

