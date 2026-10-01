

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GAMELOG</Text>
      <Text style={styles.subtitle}>Trackea. Analiza. Mejora.</Text>
      <StatusBar style="light" />
    </View>
  );
}

// Estilos centralizados en un objeto StyleSheet para mantener el JSX limpio
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B949E',
  },
});