import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

// Credenciales por defecto (usuario de prueba)
const USUARIO_DEFAULT = {
  email: 'usuario@gamelog.com',
  password: '12345678',
  nombre: 'Usuario Demo',
};

export function AuthProvider({ children }) {
  const [usuariosRegistrados, setUsuariosRegistrados] = useState([USUARIO_DEFAULT]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  // ==========================================
  // CARGAR USUARIOS AL INICIAR LA APP
  // ==========================================
  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        const guardados = await AsyncStorage.getItem('@gamelog_usuarios');
        if (guardados) {
          const lista = JSON.parse(guardados);
          // Aseguramos que el usuario default siempre esté
          const existeDefault = lista.some(u => u.email === USUARIO_DEFAULT.email);
          const listaFinal = existeDefault ? lista : [USUARIO_DEFAULT, ...lista];
          setUsuariosRegistrados(listaFinal);
          console.log('📦 Usuarios cargados desde AsyncStorage:', listaFinal.length);
        } else {
          // Si no hay nada guardado, iniciamos con el default
          await AsyncStorage.setItem('@gamelog_usuarios', JSON.stringify([USUARIO_DEFAULT]));
          console.log('📦 Iniciando con usuario default');
        }
      } catch (e) {
        console.log('❌ Error al cargar usuarios:', e);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, []);

  // ==========================================
  // REGISTRO DE USUARIO (Con persistencia)
  // ==========================================
  const registrarUsuario = async (nuevoUsuario) => {
    try {
      const nuevaLista = [...usuariosRegistrados, nuevoUsuario];
      setUsuariosRegistrados(nuevaLista);
      
      // Guardar en AsyncStorage
      await AsyncStorage.setItem('@gamelog_usuarios', JSON.stringify(nuevaLista));
      
      console.log('✅ Usuario registrado y guardado en el dispositivo:', nuevoUsuario.email);
    } catch (e) {
      console.log('❌ Error al guardar usuario:', e);
    }
  };

  // ==========================================
  // INICIO DE SESIÓN
  // ==========================================
  const iniciarSesion = (email, password) => {
    const encontrado = usuariosRegistrados.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (encontrado) {
      setUsuarioActual(encontrado);
      console.log('🔐 Sesión iniciada:', encontrado.email);
      return { success: true, usuario: encontrado };
    }
    return { success: false, mensaje: 'Usuario o contraseña incorrectos' };
  };

  // ==========================================
  // CIERRE DE SESIÓN
  // ==========================================
  const cerrarSesion = () => {
    console.log('👋 Sesión cerrada correctamente');
    setUsuarioActual(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuariosRegistrados,
        usuarioActual,
        registrarUsuario,
        iniciarSesion,
        cerrarSesion,
        cargando,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}