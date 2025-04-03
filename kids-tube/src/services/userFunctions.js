const API_URL = "http://localhost:3000/users"; // URL de la API

export async function createUser(userData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Error al registrar el usuario");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createUser:", error);
    throw error;
  }
}

export async function loginUser(email, password) {
  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas o usuario no encontrado");
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    throw error;
  }
}
