import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, FONTS } from '../utils/theme';
import { useSessions } from '../context/SessionContext';

export default function SessionScreen({ navigation }) {
  const { agregarSesion } = useSessions();

  const [juego, setJuego] = useState('');
  const [fecha, setFecha] = useState('');

  // Estados del cronómetro
  const [segundos, setSegundos] = useState(0);
  const [corriendo, setCorriendo] = useState(false);

  useEffect(() => {
    let intervalo = null;
    if (corriendo) {
      intervalo = setInterval(() => {
        setSegundos((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [corriendo]);

  // Solo permite iniciar si hay juego y fecha
  const puedeIniciar = juego.trim().length > 0 && fecha.trim().length > 0;

  const detenerYGuardar = () => {
    if (segundos === 0) return;

    setCorriendo(false);

    const hrs = Math.floor(segundos / 3600);
    const mins = Math.floor((segundos % 3600) / 60);
    const secs = segundos % 60;
    const duracionFormateada = `${hrs}h ${mins}m ${secs}s`;

    const nuevaSesion = {
      id: Date.now(),
      juego: juego.trim(),
      fecha: fecha.trim(),
      duracion: duracionFormateada,
      animo: null, // Sin emoción al principio
      excesiva: hrs >= 5,
    };

    agregarSesion(nuevaSesion);

    // Limpiar formulario
    setJuego('');
    setFecha('');
    setSegundos(0);
    
    // Regresar al Home automáticamente
    navigation.goBack();
  };

  const formatearTiempo = (totalSegundos) => {
    const hrs = Math.floor(totalSegundos / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSegundos % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSegundos % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Registrar Sesión 🎮</Text>
        <Text style={styles.subtitle}>Configura y cronometra tu partida</Text>

        {/* Inputs de Juego y Fecha */}
        <Text style={styles.label}>Nombre del juego</Text>
        <TextInput
          style={styles.input}
          value={juego}
          onChangeText={setJuego}
          placeholder="Ej. Minecraft"
          placeholderTextColor={COLORS.textSecondary}
          editable={segundos === 0}
        />

        <Text style={styles.label}>Fecha de la partida</Text>
        <TextInput
          style={styles.input}
          value={fecha}
          onChangeText={setFecha}
          placeholder="Ej. 17 Octubre 2026"
          placeholderTextColor={COLORS.textSecondary}
          editable={segundos === 0}
        />

        {/* Contenedor del Cronómetro */}
        <View style={styles.cronometroCard}>
          <Text style={styles.cronometroLabel}>TIEMPO DE JUEGO</Text>
          <Text style={styles.cronometroTexto}>{formatearTiempo(segundos)}</Text>
          
          <View style={styles.cronometroBotones}>
            {/* No ha iniciado */}
            {!corriendo && segundos === 0 && (
              <TouchableOpacity 
                style={[styles.btnCrono, styles.btnIniciar, !puedeIniciar && styles.btnDeshabilitado]} 
                onPress={() => puedeIniciar && setCorriendo(true)}
                disabled={!puedeIniciar}
              >
                <Text style={styles.btnTexto}>▶ Iniciar</Text>
              </TouchableOpacity>
            )}

            {/* Corriendo */}
            {corriendo && (
              <>
                <TouchableOpacity style={[styles.btnCrono, styles.btnPausar]} onPress={() => setCorriendo(false)}>
                  <Text style={styles.btnTexto}>⏸ Pausar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnCrono, styles.btnDetener]} onPress={detenerYGuardar}>
                  <Text style={styles.btnTexto}>⏹ Detener</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Pausado */}
            {!corriendo && segundos > 0 && (
              <>
                <TouchableOpacity style={[styles.btnCrono, styles.btnIniciar]} onPress={() => setCorriendo(true)}>
                  <Text style={styles.btnTexto}>▶ Reanudar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnCrono, styles.btnDetener]} onPress={detenerYGuardar}>
                  <Text style={styles.btnTexto}>⏹ Detener</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {!puedeIniciar && segundos === 0 && (
            <Text style={styles.warningTexto}>⚠️ Llena el juego y la fecha para iniciar</Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SIZES.padding, maxWidth: 480, width: '100%', alignSelf: 'center' },
  backButton: { marginBottom: 16 },
  backText: { color: COLORS.primary, fontSize: 16, fontFamily: 'Inter-Bold' },
  title: { ...FONTS.title, color: COLORS.primary, marginBottom: 4 },
  subtitle: { ...FONTS.subtitle, marginBottom: 24 },
  label: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.text, marginBottom: 8, marginTop: 12 },
  
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: COLORS.text,
    marginBottom: 16,
  },

  cronometroCard: {
    backgroundColor: '#0D47A1',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cronometroLabel: {
    color: '#90CAF9',
    fontSize: 13,
    fontFamily: 'Inter-Bold',
    letterSpacing: 2,
    marginBottom: 8,
  },
  cronometroTexto: {
    color: '#FFFFFF',
    fontSize: 56,
    fontFamily: 'Inter-Black',
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
    marginBottom: 24,
  },
  cronometroBotones: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  btnCrono: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  btnIniciar: { backgroundColor: COLORS.success },
  btnPausar: { backgroundColor: COLORS.warning },
  btnDetener: { backgroundColor: COLORS.error },
  btnDeshabilitado: { backgroundColor: '#607D8B', opacity: 0.5 },
  btnTexto: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter-Bold' },
  warningTexto: {
    color: '#FFCDD2',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 16,
    textAlign: 'center',
  }
});