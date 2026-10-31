import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useAudioPlayer } from 'expo-audio';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

const LogoGAMELOG = require('../assets/images/logo.png');

export default function RegisterScreen({ navigation }) {
  const { registrarUsuario } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [horasObjetivo, setHorasObjetivo] = useState('');
  const [biografia, setBiografia] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nombreError, setNombreError] = useState('');
  const [edadError, setEdadError] = useState('');
  const [horasError, setHorasError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Estado para el modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 🔊 Sonido de notificación
  const notiSound = useAudioPlayer(require('../assets/sounds/noti.mp3'));

  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const nombreRef = useRef(null);
  const edadRef = useRef(null);
  const horasRef = useRef(null);
  const bioRef = useRef(null);

  const validateEmail = (text) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(text);
  };

  const validarFormulario = () => {
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setNombreError('');
    setEdadError('');
    setHorasError('');
    setGeneralError('');

    let hasError = false;

    if (!email.trim()) {
      setEmailError('El correo es obligatorio');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Ingresa un correo válido');
      hasError = true;
    }

    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Mínimo 8 caracteres');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirma tu contraseña');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      hasError = true;
    }

    if (!nombre.trim()) {
      setNombreError('El nombre es obligatorio');
      hasError = true;
    } else if (nombre.trim().length < 3) {
      setNombreError('Mínimo 3 caracteres');
      hasError = true;
    }

    if (!edad) {
      setEdadError('La edad es obligatoria');
      hasError = true;
    } else if (isNaN(edad) || parseInt(edad) < 13 || parseInt(edad) > 120) {
      setEdadError('Edad entre 13 y 120 años');
      hasError = true;
    }

    if (!horasObjetivo) {
      setHorasError('Las horas objetivo son obligatorias');
      hasError = true;
    } else if (isNaN(horasObjetivo) || parseFloat(horasObjetivo) < 0 || parseFloat(horasObjetivo) > 24) {
      setHorasError('Entre 0 y 24 horas');
      hasError = true;
    }

    if (!aceptaTerminos) {
      setGeneralError('Debes aceptar los términos y condiciones');
      hasError = true;
    }

    return !hasError;
  };

  // ====================================================
  // PASO 3 ACTUALIZADO: Uso de async/await para persistir
  // ====================================================
  const handleRegister = () => {
    if (!validarFormulario()) return;

    setLoading(true);

    // Hacemos la función del setTimeout "async"
    setTimeout(async () => {
      // 1. Guardar usuario en AsyncStorage (esperamos a que termine)
      await registrarUsuario({
        email: email.trim(),
        password: password,
        nombre: nombre.trim(),
        edad: edad,
        horasObjetivo: horasObjetivo,
        biografia: biografia || '',
      });

      console.log('✅ Registro exitoso:', { email, nombre, edad });
      
      // 2. Reproducir sonido de notificación
      try {
        notiSound.seekTo(0);
        notiSound.play();
      } catch (e) {
        console.log('⚠️ Audio no disponible:', e?.message);
      }

      // 3. Mostrar el modal y quitar el loading
      setLoading(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  const cerrarModalEIrAlLogin = () => {
    setShowSuccessModal(false);
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Image
                source={LogoGAMELOG}
                style={styles.logoImage}
                contentFit="contain"
                transition={300}
              />
              <Text style={styles.title}>Crear cuenta</Text>
              <Text style={styles.subtitle}>
                Únete a GAMELOG y empieza a registrar tus sesiones de juego
              </Text>
            </View>

            <Text style={styles.sectionTitle}>📧 Datos de acceso</Text>

            <Input
              label="Correo electrónico"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (emailError) setEmailError('');
                if (generalError) setGeneralError('');
              }}
              placeholder="ejemplo@correo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={100}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              error={emailError}
              prefixIcon="📧"
            />

            <Input
              inputRef={passwordRef}
              label="Contraseña"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (passwordError) setPasswordError('');
              }}
              placeholder="Mínimo 8 caracteres"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={50}
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              error={passwordError}
              prefixIcon="🔒"
            />

            <Input
              inputRef={confirmPasswordRef}
              label="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={(t) => {
                setConfirmPassword(t);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              placeholder="Repite tu contraseña"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={50}
              returnKeyType="next"
              onSubmitEditing={() => nombreRef.current?.focus()}
              error={confirmPasswordError}
              prefixIcon="🔒"
            />

            <Text style={styles.sectionTitle}>👤 Datos de perfil</Text>

            <Input
              inputRef={nombreRef}
              label="Nombre de usuario"
              value={nombre}
              onChangeText={(t) => {
                setNombre(t);
                if (nombreError) setNombreError('');
              }}
              placeholder="Ej. AndrikCL"
              autoCapitalize="words"
              autoCorrect={false}
              maxLength={30}
              returnKeyType="next"
              onSubmitEditing={() => edadRef.current?.focus()}
              error={nombreError}
              prefixIcon="👤"
            />

            <Input
              inputRef={edadRef}
              label="Edad"
              value={edad}
              onChangeText={(t) => {
                setEdad(t.replace(/[^0-9]/g, ''));
                if (edadError) setEdadError('');
              }}
              placeholder="Ej. 21"
              keyboardType="number-pad"
              maxLength={3}
              returnKeyType="next"
              onSubmitEditing={() => horasRef.current?.focus()}
              error={edadError}
              prefixIcon="🎂"
            />

            <Input
              inputRef={horasRef}
              label="Horas diarias objetivo"
              value={horasObjetivo}
              onChangeText={(t) => {
                setHorasObjetivo(t.replace(/[^0-9.]/g, ''));
                if (horasError) setHorasError('');
              }}
              placeholder="Ej. 3"
              keyboardType="decimal-pad"
              maxLength={4}
              returnKeyType="next"
              onSubmitEditing={() => bioRef.current?.focus()}
              error={horasError}
              prefixIcon="⏰"
            />

            <Input
              inputRef={bioRef}
              label="Biografía (opcional)"
              value={biografia}
              onChangeText={setBiografia}
              placeholder="Cuéntanos sobre ti..."
              autoCapitalize="sentences"
              autoCorrect
              maxLength={200}
              returnKeyType="done"
              prefixIcon="📝"
            />

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => {
                setAceptaTerminos(!aceptaTerminos);
                if (generalError) setGeneralError('');
              }}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  aceptaTerminos ? styles.checkboxChecked : null,
                ]}
              >
                {aceptaTerminos && <Text style={styles.checkboxCheck}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                Acepto los{' '}
                <Text style={styles.checkboxLink}>términos y condiciones</Text>
              </Text>
            </TouchableOpacity>

            {generalError ? (
              <View style={styles.generalErrorBox}>
                <Text style={styles.generalErrorText}>⚠️ {generalError}</Text>
              </View>
            ) : null}

            <Button
              title="Crear cuenta"
              onPress={handleRegister}
              loading={loading}
            />

            <TouchableOpacity
              style={styles.loginContainer}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>
                ¿Ya tienes cuenta?{' '}
                <Text style={styles.loginLink}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ========================================================= */}
      {/* MODAL ELEGANTE DE ÉXITO */}
      {/* ========================================================= */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cerrarModalEIrAlLogin}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            
            <View style={styles.modalIconCircle}>
              <Text style={styles.modalIconText}>🎉</Text>
            </View>

            <Text style={styles.modalTitle}>¡Cuenta creada!</Text>

            <Text style={styles.modalMessage}>
              Bienvenido a GAMELOG, <Text style={styles.modalName}>{nombre}</Text>.
              {'\n\n'}
              Ahora puedes iniciar sesión con tu correo.
            </Text>

            <TouchableOpacity
              style={styles.modalButtonConfirm}
              onPress={cerrarModalEIrAlLogin}
            >
              <Text style={styles.modalButtonConfirmText}>Ir al Login</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: { alignItems: 'center', marginBottom: 24 },
  logoImage: { width: 100, height: 130, marginBottom: 8 },
  title: { ...FONTS.title, textAlign: 'center', marginBottom: 8 },
  subtitle: {
    ...FONTS.subtitle,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxCheck: { color: '#FFFFFF', fontSize: 14, fontFamily: 'Inter-Bold' },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: COLORS.text,
    lineHeight: 18,
  },
  checkboxLink: { color: COLORS.primary, fontFamily: 'Inter-Bold' },
  generalErrorBox: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  generalErrorText: {
    color: COLORS.error,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  loginContainer: { alignItems: 'center', marginTop: 20 },
  loginText: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Inter-Regular' },
  loginLink: { color: COLORS.primary, fontFamily: 'Inter-Bold' },

  // ==================== MODAL ====================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F5E9', // Verde claro para éxito
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
  modalName: {
    fontFamily: 'Inter-Bold',
    color: COLORS.primary,
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