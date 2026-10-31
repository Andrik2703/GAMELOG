import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const TAM = 40; // Tamaño de cada cubo

// Paleta de colores para las 3 capas (Azul, Verde, Rojo)
const COLORES = [
  { top: '#1E88E5', left: '#0D47A1', right: '#64B5F6' }, // Capa 1
  { top: '#43A047', left: '#1B5E20', right: '#81C784' }, // Capa 2
  { top: '#E53935', left: '#B71C1C', right: '#EF5350' }, // Capa 3
];

export default function CubosAnimados() {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación infinita de rotación 3D
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolación para simular el giro en 3D
  const rotateX = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const rotateY = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Función para crear un "cubo" (en React Native usamos Views superpuestas)
  const renderCubo = (key, capa) => {
    const paleta = COLORES[capa - 1];
    return (
      <View key={key} style={styles.cubo}>
        {/* Cara superior */}
        <View style={[styles.cara, styles.top, { backgroundColor: paleta.top }]} />
        {/* Cara izquierda */}
        <View style={[styles.cara, styles.left, { backgroundColor: paleta.left }]} />
        {/* Cara derecha */}
        <View style={[styles.cara, styles.right, { backgroundColor: paleta.right }]} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.escena3D,
          {
            transform: [
              { perspective: 1000 },
              { rotateX: rotateX },
              { rotateY: rotateY },
            ],
          },
        ]}
      >
        {/* Generamos las 3 filas */}
        {[1, 2, 3].map((fila) => (
          <View key={`fila-${fila}`} style={styles.fila}>
            {/* Generamos las 3 columnas */}
            {[1, 2, 3].map((col) => (
              <View key={`col-${col}`} style={{ flexDirection: 'row', gap: 10 }}>
                {/* Generamos las 3 capas de profundidad */}
                {[1, 2, 3].map((capa) => renderCubo(`c-${fila}-${col}-${capa}`, capa))}
              </View>
            ))}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // Ocupa toda la pantalla
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d1d1d',
    overflow: 'hidden',
  },
  escena3D: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fila: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 15,
  },
  cubo: {
    width: TAM,
    height: TAM,
    position: 'relative',
    margin: 5,
  },
  cara: {
    position: 'absolute',
    width: TAM,
    height: TAM,
    opacity: 0.9,
  },
  // Simulamos el efecto 3D con rotaciones en 2D (React Native no soporta 3D real como CSS)
  top: {
    transform: [{ rotateX: '60deg' }, { skewX: '-30deg' }],
    top: -TAM / 4,
    left: TAM / 4,
  },
  left: {
    transform: [{ skewY: '30deg' }],
    top: TAM / 4,
    left: 0,
  },
  right: {
    transform: [{ skewY: '-30deg' }],
    top: TAM / 4,
    left: TAM / 2,
  },
});