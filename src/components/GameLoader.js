import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const MENSAJES = [
  'Iniciando sistema...',
  'Cargando texturas 4K...',
  'Renderizando mapa...',
  'Generando NPCs...',
  'Optimizando FPS...',
  '¡Listo para jugar!',
];

export default function GameLoader({ onFinish }) {
  const [mensajeIndex, setMensajeIndex] = useState(0);

  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rebote del joystick
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -20,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotación de los anillos
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Parpadeo del texto final
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.2, duration: 600, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();

    // Rotación de mensajes
    const interval = setInterval(() => {
      setMensajeIndex((prev) => {
        if (prev === MENSAJES.length - 1) {
          clearInterval(interval);
          if (onFinish) setTimeout(onFinish, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const rotateReverse = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <View style={styles.container}>

      {/* Anillos de fondo (sin borderStyle, usando solo borderColor) */}
      <Animated.View style={[styles.ringOuter, { transform: [{ rotate }] }]} />
      <Animated.View style={[styles.ringInner, { transform: [{ rotate: rotateReverse }] }]} />
      
      {/* Puntos decorativos animados en los anillos */}
      <Animated.View style={[styles.orbit, { transform: [{ rotate }] }]}>
        <View style={styles.orbitDot} />
      </Animated.View>

      {/* Joystick animado */}
      <Animated.View style={[styles.joystickContainer, { transform: [{ translateY: bounceAnim }] }]}>
        <Text style={styles.joystickEmoji}>🕹️</Text>
      </Animated.View>

      <Text style={styles.loadingTitle}>CARGANDO NIVEL</Text>

      <View style={styles.messageBox}>
        <Text style={styles.messageText}>{MENSAJES[mensajeIndex]}</Text>
      </View>

      {mensajeIndex === MENSAJES.length - 1 && (
        <Animated.Text style={[styles.pressStart, { opacity: blinkAnim }]}>
          PRESS START
        </Animated.Text>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  // Anillos SIN borderStyle (evita el bug)
  ringOuter: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    borderWidth: 1,
    borderColor: 'rgba(30, 136, 229, 0.25)',
  },
  ringInner: {
    position: 'absolute',
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: width * 0.275,
    borderWidth: 1,
    borderColor: 'rgba(100, 181, 246, 0.35)',
  },

  // Puntos que orbitan (simulan el efecto "dashed")
  orbit: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  orbitDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#64B5F6',
    marginTop: -5,
  },

  joystickContainer: { marginBottom: 40 },
  joystickEmoji: { fontSize: 100 },

  loadingTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Black',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginBottom: 16,
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 250,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#64B5F6',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  pressStart: {
    position: 'absolute',
    bottom: 60,
    fontSize: 18,
    fontFamily: 'Inter-Black',
    color: '#FDD835',
    letterSpacing: 2,
  },
});