const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const youtubeService = {
  async searchVideos(query, maxResults = 10) {
    try {
      const response = await fetch(
        `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&type=video&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error.message);
      }

      return data.items.map(item => ({
        _id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));
    } catch (error) {
      console.error('Error buscando videos:', error);
      throw error;
    }
  },

  async getVideoDetails(videoId) {
    try {
      const response = await fetch(
        `${BASE_URL}/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      const video = data.items[0];
      return {
        _id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.medium.url,
        duration: video.contentDetails.duration,
        videoUrl: `https://www.youtube.com/watch?v=${video.id}`
      };
    } catch (error) {
      console.error('Error obteniendo detalles del video:', error);
      throw error;
    }
  }
};
