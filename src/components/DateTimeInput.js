import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { COLORS, SIZES, FONTS } from '../utils/theme';

export default function DateTimeInput({ label, mode = 'date', value, onChange, icon }) {
  const [modalVisible, setModalVisible] = useState(false);

  // ==========================================
  // LÓGICA DE FORMATO
  // ==========================================
  const formatearFechaVisual = (val) => {
    if (!val) return 'Seleccionar fecha';
    const [y, m, d] = val.split('-');
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${d} ${meses[parseInt(m) - 1]} ${y}`;
  };

  const formatearHoraVisual = (val) => {
    if (!val) return 'Seleccionar hora';
    return val; // Ya viene en formato HH:MM
  };

  // ==========================================
  // GENERADORES DE OPCIONES
  // ==========================================
  const horas = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutos = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const [tempHora, setTempHora] = useState(value ? value.split(':')[0] : '12');
  const [tempMinuto, setTempMinuto] = useState(value ? value.split(':')[1] : '00');

  // ==========================================
  // LÓGICA DE SELECCIÓN
  // ==========================================
  const confirmarHora = () => {
    onChange(`${tempHora}:${tempMinuto}`);
    setModalVisible(false);
  };

  const confirmarFecha = (val) => {
    onChange(val);
    setModalVisible(false);
  };

  const abrirModal = () => setModalVisible(true);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      {/* Caja que simula el input */}
      <TouchableOpacity style={styles.inputBox} onPress={abrirModal} activeOpacity={0.7}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.inputText, !value && { color: COLORS.textSecondary }]}>
          {mode === 'time' ? formatearHoraVisual(value) : formatearFechaVisual(value)}
        </Text>
      </TouchableOpacity>

      {/* MODAL PARA HORA */}
      {mode === 'time' && (
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Selecciona la hora (24h)</Text>
              
              <View style={styles.clockRow}>
                {/* Columna de Horas */}
                <View style={styles.clockColumn}>
                  <Text style={styles.clockLabel}>Hora</Text>
                  <ScrollView style={styles.clockScroll} showsVerticalScrollIndicator={false}>
                    {horas.map((h) => (
                      <TouchableOpacity
                        key={h}
                        style={[styles.clockItem, tempHora === h && styles.clockItemActive]}
                        onPress={() => setTempHora(h)}
                      >
                        <Text style={[styles.clockText, tempHora === h && styles.clockTextActive]}>{h}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                <Text style={styles.clockSeparator}>:</Text>

                {/* Columna de Minutos */}
                <View style={styles.clockColumn}>
                  <Text style={styles.clockLabel}>Minutos</Text>
                  <ScrollView style={styles.clockScroll} showsVerticalScrollIndicator={false}>
                    {minutos.map((m) => (
                      <TouchableOpacity
                        key={m}
                        style={[styles.clockItem, tempMinuto === m && styles.clockItemActive]}
                        onPress={() => setTempMinuto(m)}
                      >
                        <Text style={[styles.clockText, tempMinuto === m && styles.clockTextActive]}>{m}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}>
                  <Text style={styles.btnCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnConfirm} onPress={confirmarHora}>
                  <Text style={styles.btnConfirmText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* MODAL PARA FECHA */}
      {mode === 'date' && (
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Selecciona la fecha</Text>
              
              <View style={styles.dateGrid}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((d) => {
                  const fechaStr = `2026-10-${d.toString().padStart(2, '0')}`; // Simulado para Octubre
                  const isSelected = value === fechaStr;
                  return (
                    <TouchableOpacity
                      key={d}
                      style={[styles.dateItem, isSelected && styles.dateItemActive]}
                      onPress={() => confirmarFecha(fechaStr)}
                    >
                      <Text style={[styles.dateText, isSelected && styles.dateTextActive]}>{d}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.dateHelp}>Octubre 2026 (Demo)</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 16 },
  label: { fontSize: 15, fontFamily: 'Inter-Bold', color: COLORS.text, marginBottom: 8 },
  
  // Caja del input
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
  },
  icon: { fontSize: 20, marginRight: 12 },
  inputText: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.text },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: { fontSize: 18, fontFamily: 'Inter-Bold', color: COLORS.text, marginBottom: 20 },

  // Reloj (Hora)
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: '100%',
    marginBottom: 20,
  },
  clockColumn: {
    flex: 1,
    height: '100%',
  },
  clockLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  clockScroll: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingVertical: 8,
  },
  clockItem: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  clockItemActive: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginHorizontal: 12,
  },
  clockText: { fontSize: 18, fontFamily: 'Inter-Regular', color: COLORS.text },
  clockTextActive: { color: '#FFFFFF', fontFamily: 'Inter-Bold' },
  clockSeparator: { fontSize: 24, fontFamily: 'Inter-Bold', color: COLORS.text, marginHorizontal: 8, marginTop: 20 },

  // Calendario (Fecha)
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  dateItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dateItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateText: { fontSize: 16, fontFamily: 'Inter-Bold', color: COLORS.text },
  dateTextActive: { color: '#FFFFFF' },
  dateHelp: { fontSize: 12, fontFamily: 'Inter-Regular', color: COLORS.textSecondary, fontStyle: 'italic' },

  // Botones del modal
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  btnCancelText: { color: COLORS.text, fontSize: 15, fontFamily: 'Inter-Bold' },
  btnConfirm: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  btnConfirmText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter-Bold' },
});