import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio';
import { COLORS, SIZES, FONTS } from '../utils/theme';
import { Asset } from 'expo-asset';

let WebView = null;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

export default function MiniGameScreen({ navigation }) {
  const [html, setHtml] = useState(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showDeathModal, setShowDeathModal] = useState(false);

  // 🔊 Cargar la música del minijuego
  const gameMusic = useAudioPlayer(require('../assets/sounds/sken.mp3'));

  // Cargar el HTML del juego y la música al montar
  useEffect(() => {
    // 1. Iniciar música del juego
    try {
      gameMusic.loop = true;
      gameMusic.volume = 0.4;
      gameMusic.play();
      console.log('🎵 Música del minijuego iniciada');
    } catch (e) {
      console.log('⚠️ Error al reproducir música del minijuego:', e?.message);
    }

    // 2. Cargar el HTML
    const loadHtml = async () => {
      try {
        const asset = Asset.fromModule(require('../assets/game/index.html'));
        await asset.downloadAsync();
        const response = await fetch(asset.localUri || asset.uri);
        const text = await response.text();
        setHtml(text);
      } catch (error) {
        console.log('Error al cargar el HTML:', error);
      }
    };
    loadHtml();

    // 3. Detener música al salir
    return () => {
      try {
        gameMusic.pause();
        gameMusic.seekTo(0);
        console.log('🔇 Música del minijuego detenida');
      } catch (e) {}
    };
  }, []);

  const onMessage = (event) => {
    const message = event.nativeEvent.data;
    if (message === 'WIN') setShowWinModal(true);
    else if (message === 'DEATH') setShowDeathModal(true);
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleMessage = (event) => {
        if (event.data === 'WIN') setShowWinModal(true);
        else if (event.data === 'DEATH') setShowDeathModal(true);
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, []);

  const handleWinAccept = () => {
    setShowWinModal(false);
    try { gameMusic.pause(); } catch (e) {}
    navigation.navigate('Home');
  };

  const handleDeathAccept = () => {
    setShowDeathModal(false);
    try { gameMusic.pause(); } catch (e) {}
    navigation.navigate('Home');
  };

  const handleBack = () => {
    try { gameMusic.pause(); } catch (e) {}
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gameContainer}>
        {!html ? (
          <ActivityIndicator size="large" color={COLORS.primary} />
        ) : Platform.OS === 'web' ? (
          <iframe
            srcDoc={html}
            style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#000' }}
            title="Minijuego GAMELOG"
          />
        ) : (
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={onMessage}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Cargando juego...</Text>
              </View>
            )}
          />
        )}
      </View>

      <Modal visible={showWinModal} transparent animationType="fade" onRequestClose={handleWinAccept}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Text style={styles.modalIconText}>🏆</Text>
            </View>
            <Text style={styles.modalTitle}>¡Felicidades, Ganaste!</Text>
            <Text style={styles.modalMessage}>Has completado el minijuego con éxito.</Text>
            <TouchableOpacity style={styles.modalButtonConfirm} onPress={handleWinAccept}>
              <Text style={styles.modalButtonConfirmText}>Volver al Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showDeathModal} transparent animationType="fade" onRequestClose={handleDeathAccept}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[styles.modalIconCircle, { backgroundColor: '#FFEBEE' }]}>
              <Text style={styles.modalIconText}>💀</Text>
            </View>
            <Text style={styles.modalTitle}>¡Has Muerto!</Text>
            <Text style={styles.modalMessage}>Inténtalo de nuevo o vuelve al Home.</Text>
            <TouchableOpacity style={[styles.modalButtonConfirm, { backgroundColor: COLORS.error }]} onPress={handleDeathAccept}>
              <Text style={styles.modalButtonConfirmText}>Volver al Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', padding: SIZES.padding, backgroundColor: COLORS.background },
  backButton: { padding: 8 },
  backText: { color: COLORS.primary, fontSize: 16, fontFamily: 'Inter-Bold' },
  gameContainer: { flex: 1, width: '100%', backgroundColor: '#000' },
  webview: { flex: 1, width: '100%', backgroundColor: '#000' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#FFF', fontFamily: 'Inter-Regular' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { width: '100%', maxWidth: 400, backgroundColor: COLORS.surface, borderRadius: 24, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15 },
  modalIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  modalIconText: { fontSize: 40 },
  modalTitle: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.text, marginBottom: 12, textAlign: 'center' },
  modalMessage: { fontSize: 15, fontFamily: 'Inter-Regular', color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  modalButtonConfirm: { width: '100%', backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalButtonConfirmText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter-Bold' },
});