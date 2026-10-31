// src/services/gameApi.js

const API_KEY = '8b97873db32a43cda65d68e3dc757318';

// Ahora recibimos la página como parámetro (por defecto 1)
export async function fetchGames(page = 1) {
  // Pedimos 20 juegos por página
  const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=20&page=${page}`;

  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results; 
  } catch (error) {
    console.error('Error al obtener juegos:', error);
    throw error;
  }
}