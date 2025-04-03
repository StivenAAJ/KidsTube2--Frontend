
export async function createVideo(userData) {
  try {
    const response = await fetch("http://localhost:3000/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Error al registrar el video");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createVideo:", error);
    throw error;
  }
}

export async function videoGet(id) {
    const response = await fetch(`http://localhost:3000/videos?id=${id}`);
    const video = await response.json();
    
    if (video) {
        // Aquí manipulas el video obtenido
        console.log('video:', video);
    } else {
        console.error('No se encontró el video');
    }
}

export async function videoDelete(id) {
    console.log("Deleting course with ID:", id);
    const response = await fetch(`http://localhost:3001/videos/?id=${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      }
    });
  
    if (response.ok) {
      alert("video deleted");
      courseGet();
    } else {
      alert("Failed to delete video.");
    }
}

export async function videoPatch(id, videoData) {
    console.log("Editing video with ID:", id);
    const response = await fetch(`http://localhost:3000/videos/${id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videoData), // Usamos el objeto videoData pasado como argumento
    });
  
    if (response.ok) {
      alert("Video updated");
      return await response.json();
    } else {
      alert("Failed to update video.");
      throw new Error("Failed to update video");
    }
  }