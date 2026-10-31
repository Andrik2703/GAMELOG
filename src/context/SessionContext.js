import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [sesiones, setSesiones] = useState([]);
  const [descansos, setDescansos] = useState([]); // <-- NUEVO: Registro de sueño
  const [cargando, setCargando] = useState(true);

  // Cargar datos de AsyncStorage al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const guardadasSesiones = await AsyncStorage.getItem('@gamelog_sesiones');
        const guardadosDescansos = await AsyncStorage.getItem('@gamelog_descansos');
        
        if (guardadasSesiones) setSesiones(JSON.parse(guardadasSesiones));
        if (guardadosDescansos) setDescansos(JSON.parse(guardadosDescansos));
      } catch (e) {
        console.log('❌ Error al cargar datos:', e);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  // Guardar en AsyncStorage
  const guardarSesiones = async (nuevas) => {
    try { await AsyncStorage.setItem('@gamelog_sesiones', JSON.stringify(nuevas)); } catch (e) {}
  };
  const guardarDescansos = async (nuevos) => {
    try { await AsyncStorage.setItem('@gamelog_descansos', JSON.stringify(nuevos)); } catch (e) {}
  };

  // ==========================================
  // ACCIONES DE JUEGOS
  // ==========================================
  const agregarSesion = (nuevaSesion) => {
    const nuevas = [nuevaSesion, ...sesiones];
    setSesiones(nuevas);
    guardarSesiones(nuevas);
  };

  const eliminarSesion = (id) => {
    const nuevas = sesiones.filter((s) => s.id !== id);
    setSesiones(nuevas);
    guardarSesiones(nuevas);
  };

  const actualizarAnimo = (id, nuevoAnimo) => {
    const nuevas = sesiones.map((s) => (s.id === id ? { ...s, animo: nuevoAnimo } : s));
    setSesiones(nuevas);
    guardarSesiones(nuevas);
  };

  // ==========================================
  // ACCIONES DE DESCANSO (NUEVO)
  // ==========================================
  const agregarDescanso = (nuevoDescanso) => {
    const nuevos = [nuevoDescanso, ...descansos];
    setDescansos(nuevos);
    guardarDescansos(nuevos);
  };

  const eliminarDescanso = (id) => {
    const nuevos = descansos.filter((d) => d.id !== id);
    setDescansos(nuevos);
    guardarDescansos(nuevos);
  };

  return (
    <SessionContext.Provider
      value={{
        sesiones,
        descansos,
        agregarSesion,
        eliminarSesion,
        actualizarAnimo,
        agregarDescanso,
        eliminarDescanso,
        cargando,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessions debe usarse dentro de SessionProvider');
  }
  return context;
}