import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, FONTS } from '../utils/theme';
import { useSessions } from '../context/SessionContext';

const EMOCIONES = ['😡', '😕', '😐', '🙂', '😄'];

export default function HistoryScreen({ navigation }) {
  const { 
    sesiones, 
    descansos, 
    eliminarSesion, 
    eliminarDescanso, 
    actualizarAnimo 
  } = useSessions();

  const [tabActiva, setTabActiva] = useState('juegos'); 

  // Estados para el modal de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemAEliminar, setItemAEliminar] = useState(null); // { id, tipo, nombre }

  // Abrir modal de eliminar
  const abrirConfirmacionEliminar = (id, tipo, nombre) => {
    setItemAEliminar({ id, tipo, nombre });
    setShowDeleteModal(true);
  };

  // Confirmar eliminación
  const confirmarEliminar = () => {
    if (itemAEliminar) {
      if (itemAEliminar.tipo === 'juego') {
        eliminarSesion(itemAEliminar.id);
      } else {
        eliminarDescanso(itemAEliminar.id);
      }
      setShowDeleteModal(false);
      setItemAEliminar(null);
    }
  };

  // Cancelar eliminación
  const cancelarEliminar = () => {
    setShowDeleteModal(false);
    setItemAEliminar(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Historial 📜</Text>
      </View>

      {/* Pestañas (Tabs) */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, tabActiva === 'juegos' && styles.tabActive]}
          onPress={() => setTabActiva('juegos')}
        >
          <Text style={[styles.tabText, tabActiva === 'juegos' && styles.tabTextActive]}>
            🎮 Juegos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tabActiva === 'descanso' && styles.tabActive]}
          onPress={() => setTabActiva('descanso')}
        >
          <Text style={[styles.tabText, tabActiva === 'descanso' && styles.tabTextActive]}>
            💤 Descanso
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        {/* ================= PESTAÑA: JUEGOS ================= */}
        {tabActiva === 'juegos' && (
          <>
            {sesiones.length === 0 && (
              <Text style={styles.empty}>No hay sesiones de juego registradas.</Text>
            )}
            {sesiones.map((s) => (
              <View key={s.id} style={[styles.card, s.excesiva && styles.cardExcesiva]}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.juego}>{s.juego}</Text>
                    <Text style={styles.detalle}>{s.fecha} · {s.duracion}</Text>
                    {s.excesiva && <Text style={styles.warning}>⚠️ Sesión excesiva (+5 h)</Text>}
                  </View>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => abrirConfirmacionEliminar(s.id, 'juego', s.juego)}>
                    <Text style={styles.deleteText}>🗑️</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.emocionesContainer}>
                  <Text style={styles.emocionLabel}>¿Cómo te sentiste?</Text>
                  <View style={styles.emocionesRow}>
                    {EMOCIONES.map((emoji) => (
                      <TouchableOpacity
                        key={emoji}
                        style={[styles.emocionBtn, s.animo === emoji && styles.emocionBtnActive]}
                        onPress={() => actualizarAnimo(s.id, emoji)}
                      >
                        <Text style={[styles.emocionEmoji, s.animo !== emoji && s.animo !== null && { opacity: 0.3 }]}>
                          {emoji}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {/* ================= PESTAÑA: DESCANSO ================= */}
        {tabActiva === 'descanso' && (
          <>
            {descansos.length === 0 && (
              <Text style={styles.empty}>No hay registros de descanso.</Text>
            )}
            {descansos.map((d) => (
              <View key={d.id} style={styles.cardDescanso}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fechaDescanso}>{d.fecha}</Text>
                    <View style={styles.horasRow}>
                      <Text style={styles.horaTexto}>🌙 {d.horaDormir}</Text>
                      <Text style={styles.flecha}>→</Text>
                      <Text style={styles.horaTexto}>☀️ {d.horaDespertar}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => abrirConfirmacionEliminar(d.id, 'descanso', d.fecha)}>
                    <Text style={styles.deleteText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.totalHorasBox}>
                  <Text style={styles.totalLabel}>Total dormido</Text>
                  <Text style={styles.totalValue}>{d.horasTotales} h</Text>
                </View>
              </View>
            ))}
          </>
        )}

      </ScrollView>

      {/* MODAL ELEGANTE DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelarEliminar}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconCircle}>
              <Text style={styles.modalIconText}>🗑️</Text>
            </View>
            <Text style={styles.modalTitle}>¿Eliminar registro?</Text>
            <Text style={styles.modalMessage}>
              Estás a punto de eliminar {itemAEliminar?.tipo === 'juego' ? 'la sesión de' : 'el descanso del'} <Text style={{fontFamily: 'Inter-Bold', color: COLORS.text}}>{itemAEliminar?.nombre}</Text>. Esta acción no se puede deshacer.
            </Text>
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={cancelarEliminar}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmarEliminar}
              >
                <Text style={styles.modalButtonConfirmText}>Sí, eliminar</Text>
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
  headerContainer: { paddingHorizontal: SIZES.padding, paddingTop: SIZES.padding },
  backButton: { marginBottom: 8 },
  backText: { color: COLORS.primary, fontSize: 16, fontFamily: 'Inter-Bold' },
  title: { ...FONTS.title, color: COLORS.primary, marginBottom: 16 },

  // Pestañas
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.textSecondary },
  tabTextActive: { color: '#FFFFFF' },

  container: { padding: SIZES.padding, maxWidth: 480, width: '100%', alignSelf: 'center' },
  empty: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.textSecondary, textAlign: 'center', marginTop: 20, fontStyle: 'italic' },

  // Tarjetas de Juego
  card: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardExcesiva: { borderLeftWidth: 4, borderLeftColor: COLORS.error },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  juego: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.text, marginBottom: 4 },
  detalle: { fontSize: 13, fontFamily: 'Inter-Regular', color: COLORS.textSecondary },
  warning: { marginTop: 6, fontSize: 12, fontFamily: 'Inter-Bold', color: COLORS.error },
  deleteBtn: { padding: 8, backgroundColor: '#FFEBEE', borderRadius: 8, marginLeft: 12 },
  deleteText: { fontSize: 16 },

  // Emociones
  emocionesContainer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
  emocionLabel: { fontSize: 13, fontFamily: 'Inter-Bold', color: COLORS.textSecondary, marginBottom: 12 },
  emocionesRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  emocionBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: COLORS.background,
    alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent',
  },
  emocionBtnActive: { borderColor: COLORS.primary, backgroundColor: '#E3F2FD' },
  emocionEmoji: { fontSize: 24 },

  // Tarjetas de Descanso
  cardDescanso: {
    backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 16,
    borderLeftWidth: 4, borderLeftColor: '#64B5F6', // Azul claro
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  fechaDescanso: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.text, marginBottom: 8 },
  horasRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  horaTexto: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.textSecondary },
  flecha: { fontSize: 14, color: COLORS.textSecondary },
  totalHorasBox: {
    marginTop: 12, backgroundColor: '#E3F2FD', padding: 12, borderRadius: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  totalLabel: { fontSize: 13, fontFamily: 'Inter-Bold', color: COLORS.primary },
  totalValue: { fontSize: 18, fontFamily: 'Inter-Black', color: COLORS.primary },

  // ==================== MODAL ====================
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modalCard: {
    width: '100%', maxWidth: 400, backgroundColor: COLORS.surface, borderRadius: 24,
    padding: 28, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15,
  },
  modalIconCircle: {
    width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFEBEE', // Rojo suave
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  modalIconText: { fontSize: 32 },
  modalTitle: {
    fontSize: 22, fontFamily: 'Inter-Bold', color: COLORS.text, marginBottom: 12, textAlign: 'center',
  },
  modalMessage: {
    fontSize: 15, fontFamily: 'Inter-Regular', color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24,
  },
  modalButtonsRow: { flexDirection: 'row', width: '100%', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalButtonCancel: { backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border },
  modalButtonCancelText: { color: COLORS.text, fontSize: 15, fontFamily: 'Inter-Bold' },
  modalButtonConfirm: { backgroundColor: COLORS.error }, // Rojo para eliminar
  modalButtonConfirmText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter-Bold' },
});