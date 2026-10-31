import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAudioPlayer } from 'expo-audio';

const MusicContext = createContext();

export function MusicProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Cargar la música de fondo
  const bgMusic = useAudioPlayer(require('../assets/sounds/Fondo_pantalla.mp3'));

  useEffect(() => {
    if (bgMusic) {
      bgMusic.loop = true;    // Repetir infinitamente
      bgMusic.volume = 0.4;   // Volumen al 40% para no molestar
    }
  }, [bgMusic]);

  const playMusic = () => {
    try {
      if (!isPlaying) {
        bgMusic.play();
        setIsPlaying(true);
        console.log('🎵 Música de fondo iniciada');
      }
    } catch (e) {
      console.log('⚠️ Error al reproducir música:', e);
    }
  };

  const stopMusic = () => {
    try {
      bgMusic.pause();
      bgMusic.seekTo(0);
      setIsPlaying(false);
      console.log('🔇 Música de fondo detenida');
    } catch (e) {
      console.log('⚠️ Error al detener música:', e);
    }
  };

  return (
    <MusicContext.Provider value={{ playMusic, stopMusic, isPlaying }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic debe usarse dentro de MusicProvider');
  }
  return context;
}