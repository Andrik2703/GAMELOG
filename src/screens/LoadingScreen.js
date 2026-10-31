import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { COLORS, FONTS } from '../utils/theme';

const LogoGAMELOG = require('../assets/images/logo.png');

export default function LoadingScreen({ navigation }) {
  // Animaciones
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada del logo
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Aparecer el texto
    setTimeout(() => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 500);

    // Aparecer los puntos suspensivos
    setTimeout(() => {
      Animated.timing(dotsOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 900);

    // Animación de la barra de progreso
    Animated.timing(progressWidth, {
      toValue: 1,
      duration: 2500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Después de 3.2 segundos, navegar a Welcome
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Logo animado */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={LogoGAMELOG}
            style={styles.logoImage}
            contentFit="contain"
            transition={300}
          />
        </Animated.View>

        {/* Texto "Cargando tu bitácora" */}
        <Animated.Text style={[styles.loadingText, { opacity: textOpacity }]}>
          Cargando tu bitácora
        </Animated.Text>

        {/* Puntos suspensivos animados */}
        <Animated.Text style={[styles.dotsText, { opacity: dotsOpacity }]}>
          • • •
        </Animated.Text>

        {/* Barra de progreso */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>

        {/* Spinner de carga */}
        <Animated.View style={{ opacity: dotsOpacity }}>
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={styles.spinner}
          />
        </Animated.View>

        {/* Footer */}
        <Animated.Text style={[styles.footerText, { opacity: textOpacity }]}>
          Prepárate para jugar 🎮
        </Animated.Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoImage: {
    width: 240,
    height: 320,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: COLORS.text,
    letterSpacing: 1,
    marginTop: 16,
    textAlign: 'center',
  },
  dotsText: {
    fontSize: 20,
    color: COLORS.primary,
    letterSpacing: 4,
    marginTop: 8,
    marginBottom: 32,
  },
  progressContainer: {
    width: '80%',
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  spinner: {
    marginTop: 8,
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
});