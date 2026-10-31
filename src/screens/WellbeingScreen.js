import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio'; // <-- IMPORT PARA EL SONIDO
import { COLORS, SIZES, FONTS } from '../utils/theme';
import { useSessions } from '../context/SessionContext';
import DateTimeInput from '../components/DateTimeInput';

export default function WellbeingScreen({ navigation }) {
  const { agregarDescanso } = useSessions();

  const [horaDormir, setHoraDormir] = useState('');
  const [horaDespertar, setHoraDespertar] = useState('');
  const [fecha, setFecha] = useState('');

  // Estados para el modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Sonido de notificación
  const notiSound = useAudioPlayer(require('../assets/sounds/noti.mp3'));

  const handleGuardar = () => {
    if (!horaDormir || !horaDespertar || !fecha) {
      if (Platform.OS === 'web') {
        window.alert('Completa todos los campos.');
      } else {
        Alert.alert('Error', 'Completa todos los campos.');
      }
      return;
    }

    const [hDormir, mDormir] = horaDormir.split(':').map(Number);
    const [hDespertar, mDespertar] = horaDespertar.split(':').map(Number);

    let totalMinutos = (hDespertar * 60 + mDespertar) - (hDormir * 60 + mDormir);
    if (totalMinutos < 0) totalMinutos += 24 * 60;

    const horasCalculadas = (totalMinutos / 60).toFixed(1);

    const nuevoDescanso = {
      id: Date.now(),
      fecha: fecha,
      horaDormir: horaDormir,
      horaDespertar: horaDespertar,
      horasTotales: horasCalculadas,
    };

    agregarDescanso(nuevoDescanso);

    // 🔊 Reproducir sonido
    try {
      notiSound.seekTo(0);
      notiSound.play();
    } catch (e) {
      console.log('⚠️ Audio no disponible:', e?.message);
    }

    // Mostrar modal elegante
    setShowSuccessModal(true);
  };

  const cerrarModalEIrAlHistorial = () => {
    setShowSuccessModal(false);
    navigation.goBack(); // O navigation.navigate('History') si quieres llevarlo directo
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Bienestar 💤</Text>
        <Text style={styles.subtitle}>Registra tu descanso</Text>

        {/* Fila de Horas */}
        <Text style={styles.sectionLabel}>Horario de sueño</Text>
        <View style={styles.timeRow}>
          <View style={styles.halfInput}>
            <DateTimeInput
              label="Dormiste"
              mode="time"
              value={horaDormir}
              onChange={setHoraDormir}
              icon="🌙"
            />
          </View>
          
          <Text style={styles.arrow}>→</Text>
          
          <View style={styles.halfInput}>
            <DateTimeInput
              label="Despertaste"
              mode="time"
              value={horaDespertar}
              onChange={setHoraDespertar}
              icon="☀️"
            />
          </View>
        </View>

        {/* Selector de Fecha */}
        <DateTimeInput
          label="Fecha del registro"
          mode="date"
          value={fecha}
          onChange={setFecha}
          icon="📅"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
          <Text style={styles.saveButtonText}>Guardar descanso</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL ELEGANTE DE ÉXITO */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cerrarModalEIrAlHistorial}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Text style={styles.modalIconText}>✅</Text>
            </View>
            <Text style={styles.modalTitle}>¡Registro exitoso!</Text>
            <Text style={styles.modalMessage}>
              Tu descanso ha sido guardado correctamente en el historial.
            </Text>
            <TouchableOpacity
              style={styles.modalButtonConfirm}
              onPress={cerrarModalEIrAlHistorial}
            >
              <Text style={styles.modalButtonConfirmText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  sectionLabel: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.text, marginBottom: 12 },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  halfInput: { flex: 1 },
  arrow: { fontSize: 20, color: COLORS.textSecondary, marginTop: 20 },
  saveButton: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter-Bold' },

  // Estilos del Modal de Éxito
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F5E9', // Verde claro
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
  modalButtonConfirm: {
    width: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonConfirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter-Bold',
  },
});