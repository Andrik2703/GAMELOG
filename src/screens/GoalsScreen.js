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
import { COLORS, SIZES, FONTS } from '../utils/theme';
import Input from '../components/Input';

// Datos iniciales (ejemplo)
const OBJETIVOS_INICIALES = [
  { 
    id: 1, 
    juego: 'Gaming general', 
    descripcion: 'Jugar menos de 15 h/semana', 
    progreso: 12.4, 
    meta: 15, 
    tipo: 'juego', 
    color: COLORS.primary,
    fechaLimite: 'Sin límite',
    medida: 'horas' // 'horas', 'fecha', 'sin_limite'
  },
  { 
    id: 2, 
    juego: 'Sueño', 
    descripcion: 'Dormir más de 7 h', 
    progreso: 5.2, 
    meta: 7, 
    tipo: 'sueno', 
    color: COLORS.error,
    fechaLimite: '31 Dic 2026',
    medida: 'horas'
  },
];

const LOGROS = [
  { id: 1, icon: '🏅', nombre: 'Primera semana', descripcion: 'Registraste 7 días seguidos', desbloqueado: true },
  { id: 2, icon: '📊', nombre: 'Analista', descripcion: 'Revisaste 5 correlaciones', desbloqueado: true },
  { id: 3, icon: '😴', nombre: 'Durmiendo bien', descripcion: '7 días con +7 h de sueño', desbloqueado: false },
];

export default function GoalsScreen({ navigation }) {
  const [objetivos, setObjetivos] = useState(OBJETIVOS_INICIALES);
  const [showModal, setShowModal] = useState(false);

  // Estados para el formulario
  const [juego, setJuego] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('juego');
  
  // Nuevos estados para la medida de la meta
  const [tipoMedida, setTipoMedida] = useState('horas'); // 'horas', 'fecha', 'sin_limite'
  const [metaValor, setMetaValor] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');

  const handleCrearObjetivo = () => {
    if (!descripcion) {
      if (Platform.OS === 'web') window.alert('Por favor, llena la descripción.');
      else Alert.alert('Error', 'Por favor, llena la descripción.');
      return;
    }

    if (tipoMedida === 'horas' && !metaValor) {
      if (Platform.OS === 'web') window.alert('Por favor, ingresa el límite de horas.');
      else Alert.alert('Error', 'Por favor, ingresa el límite de horas.');
      return;
    }

    if (tipoMedida === 'fecha' && !fechaLimite) {
      if (Platform.OS === 'web') window.alert('Por favor, ingresa la fecha límite.');
      else Alert.alert('Error', 'Por favor, ingresa la fecha límite.');
      return;
    }

    const nuevoObjetivo = {
      id: Date.now(),
      juego: juego || (tipo === 'juego' ? 'Gaming general' : 'Sueño'),
      descripcion,
      progreso: 0,
      meta: tipoMedida === 'horas' ? parseFloat(metaValor) : null,
      tipo,
      color: tipo === 'juego' ? COLORS.primary : COLORS.error,
      fechaLimite: tipoMedida === 'fecha' ? fechaLimite : (tipoMedida === 'sin_limite' ? 'Sin límite' : 'Sin fecha'),
      medida: tipoMedida
    };

    setObjetivos([...objetivos, nuevoObjetivo]);
    setShowModal(false);
    
    // Limpiar formulario
    setJuego('');
    setDescripcion('');
    setMetaValor('');
    setFechaLimite('');
    setTipo('juego');
    setTipoMedida('horas');
  };

  // Componente visual del Reloj de Progreso
  const RelojProgreso = ({ progreso, meta, color, medida }) => {
    // Si es sin límite o por fecha, mostramos un ícono diferente
    if (medida === 'sin_limite') {
      return (
        <View style={styles.relojContainer}>
          <View style={[styles.relojBorde, { borderColor: COLORS.textSecondary }]}>
            <Text style={{ fontSize: 24 }}>∞</Text>
          </View>
          <Text style={styles.relojLabel}>Libre</Text>
        </View>
      );
    }

    if (medida === 'fecha') {
      return (
        <View style={styles.relojContainer}>
          <View style={[styles.relojBorde, { borderColor: color }]}>
            <Text style={{ fontSize: 24 }}>📅</Text>
          </View>
          <Text style={styles.relojLabel}>Por fecha</Text>
        </View>
      );
    }

    // Si es por horas (reloj normal)
    const porcentaje = Math.min(100, (progreso / meta) * 100);
    return (
      <View style={styles.relojContainer}>
        <View style={[styles.relojBorde, { borderColor: color }]}>
          <View style={[styles.relojRelleno, { height: `${porcentaje}%`, backgroundColor: color }]} />
          <Text style={[styles.relojTexto, porcentaje > 50 && styles.relojTextoBlanco]}>
            {Math.round(porcentaje)}%
          </Text>
        </View>
        <Text style={styles.relojLabel}>{progreso} / {meta} h</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Objetivos 🎯</Text>
          <Text style={styles.subtitle}>Gestiona tus metas y logros</Text>
        </View>

        {/* Sección Activos */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Activos</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
            <Text style={styles.addButtonText}>+ Nuevo objetivo</Text>
          </TouchableOpacity>
        </View>

        {objetivos.map((o) => (
          <View key={o.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.juego}>{o.juego}</Text>
                <Text style={styles.objetivo}>{o.descripcion}</Text>
                <Text style={styles.fecha}>📅 {o.fechaLimite}</Text>
              </View>
              <RelojProgreso 
                progreso={o.progreso} 
                meta={o.meta} 
                color={o.color} 
                medida={o.medida} 
              />
            </View>
          </View>
        ))}

        {/* Sección Logros */}
        <Text style={styles.sectionTitle}>Logros</Text>
        {LOGROS.map((l) => (
          <View key={l.id} style={[styles.logroCard, !l.desbloqueado && styles.logroBloqueado]}>
            <Text style={styles.logroIcon}>{l.desbloqueado ? l.icon : '🔒'}</Text>
            <View style={styles.logroInfo}>
              <Text style={styles.logroNombre}>{l.nombre}</Text>
              <Text style={styles.logroDesc}>{l.descripcion}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal para crear un nuevo objetivo */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Crear nuevo objetivo</Text>

            {/* Botones de tipo de meta (Juego / Sueño) */}
            <Text style={styles.label}>Tipo de meta</Text>
            <View style={styles.chipsRow}>
              <TouchableOpacity
                style={[styles.chip, tipo === 'juego' && styles.chipActive]}
                onPress={() => setTipo('juego')}
              >
                <Text style={[styles.chipText, tipo === 'juego' && styles.chipTextActive]}>🎮 Juego</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chip, tipo === 'sueno' && styles.chipActiveRed]}
                onPress={() => setTipo('sueno')}
              >
                <Text style={[styles.chipText, tipo === 'sueno' && styles.chipTextActive]}>😴 Sueño</Text>
              </TouchableOpacity>
            </View>

            <Input
              label={tipo === 'juego' ? 'Juego / Categoría (opcional)' : 'Sueño (opcional)'}
              value={juego}
              onChangeText={setJuego}
              placeholder={tipo === 'juego' ? 'Ej. Minecraft' : 'Ej. Descanso general'}
              prefixIcon={tipo === 'juego' ? '🎮' : '😴'}
            />

            <Input
              label="Descripción de la meta"
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Ej. Conseguir diamante"
              prefixIcon="📝"
            />

            {/* NUEVO: Selector de tipo de medida */}
            <Text style={styles.label}>Tipo de límite</Text>
            <View style={styles.chipsRow}>
              <TouchableOpacity
                style={[styles.chipSmall, tipoMedida === 'horas' && styles.chipActive]}
                onPress={() => setTipoMedida('horas')}
              >
                <Text style={[styles.chipSmallText, tipoMedida === 'horas' && styles.chipTextActive]}>⏱️ Horas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chipSmall, tipoMedida === 'fecha' && styles.chipActive]}
                onPress={() => setTipoMedida('fecha')}
              >
                <Text style={[styles.chipSmallText, tipoMedida === 'fecha' && styles.chipTextActive]}>📅 Fecha</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.chipSmall, tipoMedida === 'sin_limite' && styles.chipActive]}
                onPress={() => setTipoMedida('sin_limite')}
              >
                <Text style={[styles.chipSmallText, tipoMedida === 'sin_limite' && styles.chipTextActive]}>∞ Sin límite</Text>
              </TouchableOpacity>
            </View>

            {/* Campos condicionales según el tipo de límite */}
            {tipoMedida === 'horas' && (
              <Input
                label={tipo === 'juego' ? 'Meta (Horas máximas)' : 'Meta (Horas mínimas)'}
                value={metaValor}
                onChangeText={(t) => setMetaValor(t.replace(/[^0-9.]/g, ''))}
                placeholder="Ej. 10"
                keyboardType="decimal-pad"
                prefixIcon="⏱️"
              />
            )}

            {tipoMedida === 'fecha' && (
              <Input
                label="Fecha límite"
                value={fechaLimite}
                onChangeText={setFechaLimite}
                placeholder="Ej. 31 Dic 2026"
                prefixIcon="📅"
              />
            )}

            {tipoMedida === 'sin_limite' && (
              <View style={styles.sinLimiteBox}>
                <Text style={styles.sinLimiteText}>
                  Sin límite de tiempo. Podrás completar esta meta a tu ritmo.
                </Text>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleCrearObjetivo}
              >
                <Text style={styles.saveButtonText}>Guardar meta</Text>
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
  container: { padding: SIZES.padding, maxWidth: 480, width: '100%', alignSelf: 'center' },
  header: { marginBottom: 20 },
  backButton: { marginBottom: 12 },
  backText: { color: COLORS.primary, fontSize: 16, fontFamily: 'Inter-Bold' },
  title: { ...FONTS.title, color: COLORS.primary },
  subtitle: { ...FONTS.subtitle },
  
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 12,
  },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.text },
  addButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: { color: COLORS.primary, fontSize: 13, fontFamily: 'Inter-Bold' },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  juego: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.text, marginBottom: 4 },
  objetivo: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.textSecondary, marginBottom: 4 },
  fecha: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.textSecondary },
  
  // Estilos del Reloj de Progreso
  relojContainer: { alignItems: 'center', marginLeft: 16 },
  relojBorde: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  relojRelleno: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    opacity: 0.8,
  },
  relojTexto: {
    fontSize: 16,
    fontFamily: 'Inter-Black',
    color: COLORS.text,
    zIndex: 10,
    marginBottom: 18, 
  },
  relojTextoBlanco: {
    color: '#FFFFFF',
  },
  relojLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: COLORS.textSecondary,
    marginTop: 6,
  },

  logroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  logroBloqueado: { opacity: 0.5 },
  logroIcon: { fontSize: 28, marginRight: 14 },
  logroInfo: { flex: 1 },
  logroNombre: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.text },
  logroDesc: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.textSecondary, marginTop: 2 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: { fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.text, marginBottom: 20 },
  label: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.text, marginBottom: 8 },
  
  chipsRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  chip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  chipSmall: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipActiveRed: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  chipText: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.text },
  chipSmallText: { fontSize: 13, fontFamily: 'Inter-Bold', color: COLORS.text },
  chipTextActive: { color: '#FFFFFF' },

  sinLimiteBox: {
    backgroundColor: '#F5F7FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sinLimiteText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  modalActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border },
  cancelButtonText: { color: COLORS.text, fontFamily: 'Inter-Bold' },
  saveButton: { backgroundColor: COLORS.primary },
  saveButtonText: { color: '#FFFFFF', fontFamily: 'Inter-Bold' },
});