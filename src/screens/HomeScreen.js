import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useAudioPlayer } from 'expo-audio';
import { COLORS, SIZES, FONTS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';

const LogoGAMELOG = require('../assets/images/logo.png');

// Lista de funciones principales para el menú
const FUNCIONES = [
  { id: 1, icon: '🎮', title: 'Registrar Sesión', screen: 'Session', color: '#E3F2FD' },
  { id: 2, icon: '📜', title: 'Historial', screen: 'History', color: '#F3E5F5' },
  { id: 3, icon: '💤', title: 'Bienestar', screen: 'Wellbeing', color: '#E8F5E9' },
  { id: 4, icon: '🎯', title: 'Objetivos', screen: 'Goals', color: '#FFF3E0' },
  { id: 5, icon: '👤', title: 'Mi Perfil', screen: 'Profile', color: '#FCE4EC' },
  { id: 6, icon: '🎮', title: 'Catálogo', screen: 'Catalog', color: '#E1F5FE' },
];

export default function HomeScreen({ navigation }) {
  const { cerrarSesion } = useAuth();
  const { playMusic, stopMusic } = useMusic();
  
  const [notificaciones, setNotificaciones] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const notiSound = useAudioPlayer(require('../assets/sounds/noti.mp3'));

  // =========================================================
  // ANIMACIONES DE FONDO (Emojis flotantes)
  // =========================================================
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    playMusic();

    const createFloatAnimation = (anim, duration, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };

    const anim1 = createFloatAnimation(floatAnim1, 3000, 0);
    const anim2 = createFloatAnimation(floatAnim2, 4000, 500);
    const anim3 = createFloatAnimation(floatAnim3, 3500, 1000);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, []);

  const translateY1 = floatAnim1.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
  const translateY2 = floatAnim2.interpolate({ inputRange: [0, 1], outputRange: [0, 25] });
  const translateY3 = floatAnim3.interpolate({ inputRange: [0, 1], outputRange: [0, -15] });

  // =========================================================
  // SISTEMA DE NOTIFICACIONES
  // =========================================================
  const simularNotificacion = (tipo) => {
    const nuevaNotificacion = {
      id: Date.now(),
      tipo: tipo,
      titulo:
        tipo === 'alerta'
          ? '⚠️ Alerta de bienestar'
          : tipo === 'logro'
          ? '🏆 ¡Nuevo logro!'
          : '📊 Resumen semanal',
      mensaje:
        tipo === 'alerta'
          ? 'Has jugado más de 5 horas seguidas. Recuerda descansar.'
          : tipo === 'logro'
          ? 'Has desbloqueado "Primera semana". ¡Sigue así!'
          : 'Tu tiempo de juego disminuyó un 15% esta semana.',
      leida: false,
      fecha: new Date().toLocaleTimeString(),
    };

    try {
      notiSound.seekTo(0);
      notiSound.play();
    } catch (e) {
      console.log('⚠️ Audio no disponible:', e?.message);
    }

    setNotificaciones((prev) => [nuevaNotificacion, ...prev]);
    console.log('🔔 Notificación recibida:', nuevaNotificacion.titulo);
  };

  const marcarComoLeida = (id) => {
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  // =========================================================
  // MODAL DE CIERRE DE SESIÓN
  // =========================================================
  const handleLogoutPress = () => setShowLogoutModal(true);

  const confirmarCierreSesion = () => {
    setShowLogoutModal(false);
    console.log('✅ Cerrando sesión...');
    stopMusic();
    cerrarSesion();
    navigation.replace('Login');
  };

  const cancelarCierreSesion = () => {
    setShowLogoutModal(false);
    console.log('❌ Cierre de sesión cancelado por el usuario');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Íconos flotantes de fondo */}
      <Animated.Text style={[styles.floatingIcon, { top: '15%', left: '5%', transform: [{ translateY: translateY1 }] }]}>🎮</Animated.Text>
      <Animated.Text style={[styles.floatingIcon, { top: '30%', right: '10%', transform: [{ translateY: translateY2 }] }]}>🕹️</Animated.Text>
      <Animated.Text style={[styles.floatingIcon, { bottom: '20%', left: '10%', transform: [{ translateY: translateY3 }] }]}>👾</Animated.Text>
      <Animated.Text style={[styles.floatingIcon, { top: '60%', right: '5%', transform: [{ translateY: translateY1 }] }]}>🏆</Animated.Text>

      <ScrollView contentContainerStyle={styles.container}>
        
        {/* ========================================================= */}
        {/* HEADER CON LOGO CENTRADO */}
        {/* ========================================================= */}
                <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MiniGame')}
            activeOpacity={0.8}
          >
            <Image
              source={LogoGAMELOG}
              style={styles.logoImage}
              contentFit="contain"
              transition={300}
            />
          </TouchableOpacity>
        </View>

        {/* ========================================================= */}
        {/* MENÚ DE FUNCIONES (Tarjetas) */}
        {/* ========================================================= */}
        <Text style={styles.sectionTitle}>Funciones de GAMELOG</Text>
        
        <View style={styles.grid}>
          {FUNCIONES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.functionCard, { backgroundColor: item.color }]}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.8}
            >
              <Text style={styles.functionIcon}>{item.icon}</Text>
              <Text style={styles.functionTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ========================================================= */}
        {/* BOTÓN DESTACADO DEL CRONÓMETRO */}
        {/* ========================================================= */}
        <TouchableOpacity
          style={styles.cronometroBoton}
          onPress={() => navigation.navigate('Session')}
          activeOpacity={0.9}
        >
          <View style={styles.cronometroIconContainer}>
            <Text style={styles.cronometroIcon}>⏱️</Text>
          </View>
          <View style={styles.cronometroTextContainer}>
            <Text style={styles.cronometroTitulo}>Iniciar Cronómetro</Text>
            <Text style={styles.cronometroSub}>Registra tu tiempo de juego ahora</Text>
          </View>
        </TouchableOpacity>

        {/* ========================================================= */}
        {/* SECCIÓN: SISTEMA DE NOTIFICACIONES */}
        {/* ========================================================= */}
        <View style={styles.notifSection}>
          <Text style={styles.sectionTitle}>🔔 Notificaciones</Text>

          <View style={styles.notifButtonsRow}>
            <TouchableOpacity
              style={[styles.notifButton, { backgroundColor: '#FFF3E0' }]}
              onPress={() => simularNotificacion('alerta')}
            >
              <Text style={styles.notifButtonText}>⚠️ Alerta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.notifButton, { backgroundColor: '#E8F5E9' }]}
              onPress={() => simularNotificacion('logro')}
            >
              <Text style={styles.notifButtonText}>🏆 Logro</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.notifButton, { backgroundColor: '#E3F2FD' }]}
              onPress={() => simularNotificacion('resumen')}
            >
              <Text style={styles.notifButtonText}>📊 Resumen</Text>
            </TouchableOpacity>
          </View>

          {notificaciones.length === 0 ? (
            <Text style={styles.emptyNotifText}>
              No tienes notificaciones nuevas.
            </Text>
          ) : (
            notificaciones.map((notif) => (
              <TouchableOpacity
                key={notif.id}
                style={[
                  styles.notifCard,
                  notif.leida ? styles.notifCardRead : null,
                ]}
                onPress={() => marcarComoLeida(notif.id)}
              >
                <Text style={styles.notifTitle}>{notif.titulo}</Text>
                <Text style={styles.notifMessage}>{notif.mensaje}</Text>
                <Text style={styles.notifTime}>{notif.fecha}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Botón de Cerrar Sesión */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogoutPress}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* MODAL PERSONALIZADO DE CIERRE DE SESIÓN */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelarCierreSesion}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Text style={styles.modalIconText}>🚪</Text>
            </View>
            <Text style={styles.modalTitle}>Cerrar sesión</Text>
            <Text style={styles.modalMessage}>
              ¿Estás seguro de que quieres cerrar sesión? Tendrás que volver a ingresar tus credenciales.
            </Text>
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={cancelarCierreSesion}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmarCierreSesion}
              >
                <Text style={styles.modalButtonConfirmText}>Sí, cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: {
    padding: SIZES.padding,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    zIndex: 10, 
  },
  
  // ==========================================
  // HEADER CON LOGO CENTRADO
  // ==========================================
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  logoImage: {
    width: 140,
    height: 180,
  },
  
  // Íconos de fondo
  floatingIcon: {
    position: 'absolute',
    fontSize: 60,
    opacity: 0.08,
    zIndex: 1,
  },

  // Grid de funciones
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  functionCard: {
    width: '48%',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  functionIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  functionTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: COLORS.text,
    textAlign: 'center',
  },

  // Cronómetro
  cronometroBoton: {
    flexDirection: 'row',
    backgroundColor: '#0D47A1',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#0D47A1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  cronometroIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cronometroIcon: {
    fontSize: 28,
  },
  cronometroTextContainer: {
    flex: 1,
  },
  cronometroTitulo: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cronometroSub: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#90CAF9',
  },

  // Notificaciones
  notifSection: { marginBottom: 24 },
  notifButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  notifButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  notifButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    color: COLORS.text,
  },
  emptyNotifText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  notifCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  notifCardRead: {
    opacity: 0.6,
    borderLeftColor: COLORS.border,
  },
  notifTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  notifMessage: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: COLORS.text,
    lineHeight: 18,
  },
  notifTime: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    marginTop: 6,
  },

  // Cerrar sesión
  logoutButton: {
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.error,
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconText: { fontSize: 32 },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  modalButtonCancelText: {
    color: COLORS.text,
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
  modalButtonConfirm: { backgroundColor: COLORS.error },
  modalButtonConfirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
});