import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, FONTS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { usuarioActual } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {usuarioActual?.nombre ? usuarioActual.nombre.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <Text style={styles.nombre}>{usuarioActual?.nombre || 'Usuario'}</Text>
          <Text style={styles.email}>{usuarioActual?.email || 'sin correo'}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Edad</Text>
          <Text style={styles.infoValue}>{usuarioActual?.edad || '—'} años</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Horas diarias objetivo</Text>
          <Text style={styles.infoValue}>{usuarioActual?.horasObjetivo || '—'} h</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Biografía</Text>
          <Text style={styles.infoValue}>{usuarioActual?.biografia || 'Sin biografía'}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Zona horaria</Text>
          <Text style={styles.infoValue}>GMT-8 Tijuana</Text>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Editar perfil</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SIZES.padding, maxWidth: 480, width: '100%', alignSelf: 'center' },
  backButton: { marginBottom: 16 },
  backText: { color: COLORS.primary, fontSize: 16, fontFamily: 'Inter-Bold' },
  avatarContainer: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#FFFFFF', fontSize: 42, fontFamily: 'Inter-Black' },
  nombre: { fontSize: 24, fontFamily: 'Inter-Bold', color: COLORS.text },
  email: { fontSize: 14, fontFamily: 'Inter-Regular', color: COLORS.textSecondary, marginTop: 4 },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  infoLabel: { fontSize: 13, fontFamily: 'Inter-Bold', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  infoValue: { fontSize: 16, fontFamily: 'Inter-Regular', color: COLORS.text },
  editButton: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  editText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter-Bold' },
});