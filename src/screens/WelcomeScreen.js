import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useAudioPlayer } from 'expo-audio';
import { COLORS, SIZES } from '../utils/theme';

const LogoGAMELOG = require('../assets/images/logo.png');

// Información de cada característica
const FEATURES = [
  {
    id: 1,
    icon: '🎮',
    title: 'Registra cada partida',
    shortText: 'Lleva un control de tus sesiones de juego',
    longText:
      'Registra cada sesión de videojuegos con detalles como el juego, la plataforma, la duración, el tipo de sesión (competitiva, casual o cooperativa) y tu estado de ánimo antes y después de jugar. Así podrás ver patrones en tu comportamiento a lo largo del tiempo.',
  },
  {
    id: 2,
    icon: '😴',
    title: 'Analiza tu sueño',
    shortText: 'Descubre cómo el juego afecta tu descanso',
    longText:
      'GAMELOG registra tus horas de sueño y la hora a la que te dormiste. Con estos datos, la aplicación calcula correlaciones entre tus horas de juego y la calidad de tu descanso. Podrás saber si jugar hasta tarde afecta tu sueño o si hay días en los que descansas mejor.',
  },
  {
    id: 3,
    icon: '📊',
    title: 'Descubre correlaciones',
    shortText: 'Encuentra relaciones entre tus hábitos',
    longText:
      'Mediante análisis estadísticos (coeficientes de Pearson o Spearman), GAMELOG identifica relaciones entre tus horas de juego, tu sueño, tu estado de ánimo y tus gastos en microtransacciones. Por ejemplo: "Cuando juegas más de 5 horas seguidas, duermes 1.8 horas menos en promedio".',
  },
  {
    id: 4,
    icon: '🎯',
    title: 'Cumple tus objetivos',
    shortText: 'Establece metas y mejora tus hábitos',
    longText:
      'Define objetivos personales como "jugar menos de 15 horas a la semana" o "dormir más de 7 horas". GAMELOG te muestra barras de progreso, te avisa cuando estás cerca de cumplir tus metas y te recompensa con logros desbloqueables. También puedes programar recordatorios personalizados.',
  },
];

export default function WelcomeScreen({ navigation }) {
  const [musicStarted, setMusicStarted] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  // Animaciones
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.5)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  const featuresOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Música de fondo
  const backgroundMusic = useAudioPlayer(
    require('../assets/sounds/welcome-music.mp3')
  );

  const handleSkip = () => {
    try {
      backgroundMusic.pause();
    } catch (e) {}
    navigation.replace('Home');
  };

  const openFeature = (feature) => {
    setSelectedFeature(feature);
  };

  const closeFeature = () => {
    setSelectedFeature(null);
  };

  useEffect(() => {
    // Iniciar música
    const startMusic = () => {
      try {
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.4;
        backgroundMusic.play();
        setMusicStarted(true);
      } catch (e) {
        console.log('⚠️ Música no disponible:', e?.message);
      }
    };

    // Secuencia de animaciones
    const sequence = Animated.sequence([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(titleScale, {
          toValue: 1,
          friction: 5,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(descriptionOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(featuresOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    sequence.start();
    setTimeout(startMusic, 200);

    return () => {
      try {
        backgroundMusic.pause();
      } catch (e) {}
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          {/* Botón Skip */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Saltar →</Text>
          </TouchableOpacity>

          {/* Logo */}
          <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
            <Image
              source={LogoGAMELOG}
              style={styles.logoImage}
              contentFit="contain"
              transition={300}
            />
          </Animated.View>

          {/* Título */}
          <Animated.Text
            style={[
              styles.title,
              {
                opacity: titleOpacity,
                transform: [{ scale: titleScale }],
              },
            ]}
          >
            Bienvenido a GAMELOG
          </Animated.Text>

          {/* Subtítulo */}
          <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
            Tu bitácora de bienestar gamer
          </Animated.Text>

          {/* Descripción */}
          <Animated.View
            style={[styles.descriptionBox, { opacity: descriptionOpacity }]}
          >
            <Text style={styles.descriptionText}>
              GAMELOG es una aplicación que registra tus sesiones de videojuegos
              y las relaciona con tu bienestar: sueño, estado de ánimo y gastos.
            </Text>
          </Animated.View>

          {/* Características clicables */}
          <Animated.View
            style={[styles.featuresBox, { opacity: featuresOpacity }]}
          >
            <Text style={styles.featuresTitle}>
              Toca cada tarjeta para más información 👇
            </Text>
            {FEATURES.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={styles.featureItem}
                onPress={() => openFeature(feature)}
                activeOpacity={0.7}
              >
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureSubtitle}>{feature.shortText}</Text>
                </View>
                <Text style={styles.featureArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Indicador de música */}
          {musicStarted && (
            <View style={styles.musicIndicator}>
              <Text style={styles.musicText}>🎵 Reproduciendo música...</Text>
            </View>
          )}

          {/* Botón Comenzar */}
          <Animated.View
            style={[styles.buttonContainer, { opacity: buttonOpacity }]}
          >
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleSkip}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>Comenzar →</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </ScrollView>

      {/* Modal con información detallada */}
      <Modal
        visible={selectedFeature !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeFeature}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeFeature}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            {selectedFeature && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalIcon}>{selectedFeature.icon}</Text>
                  <Text style={styles.modalTitle}>{selectedFeature.title}</Text>
                </View>
                <Text style={styles.modalText}>{selectedFeature.longText}</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={closeFeature}
                >
                  <Text style={styles.modalButtonText}>Entendido</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  skipButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 136, 229, 0.1)',
    zIndex: 10,
  },
  skipText: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  logoContainer: {
    marginBottom: 16,
    marginTop: 20,
  },
  logoImage: {
    width: 140,
    height: 180,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Black',
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  descriptionBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    width: '100%',
    maxWidth: 460,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresBox: {
    width: '100%',
    maxWidth: 460,
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 26,
    marginRight: 14,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: COLORS.text,
  },
  featureSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  featureArrow: {
    fontSize: 24,
    color: COLORS.primary,
    fontFamily: 'Inter-Bold',
    marginLeft: 8,
  },
  musicIndicator: {
    marginBottom: 12,
  },
  musicText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 460,
    marginTop: 8,
    marginBottom: 20,
  },
  startButton: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1,
  },

  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIcon: {
    fontSize: 40,
    marginRight: 14,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: COLORS.primary,
  },
  modalText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});