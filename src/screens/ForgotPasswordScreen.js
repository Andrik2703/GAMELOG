import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import emailjs from '@emailjs/browser';
import { useAudioPlayer } from 'expo-audio';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS } from '../utils/theme';

// ⚠️ CREDENCIALES DE EMAILJS
const EMAILJS_SERVICE_ID = 'GAMELOG';
const EMAILJS_TEMPLATE_ID = 'template_klkpnxi';
const EMAILJS_PUBLIC_KEY = '2Cm-ZIl0xfmS8NPwL';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 🔊 Cargar el sonido de notificación
  const notificationSound = useAudioPlayer(
    require('../assets/sounds/notification.mp3')
  );

  const validateEmail = (text) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(text);
  };

  const mostrarAlerta = (titulo, mensaje, callback) => {
    if (Platform.OS === 'web') {
      window.alert(`${titulo}\n\n${mensaje}`);
      if (callback) callback();
    } else {
      Alert.alert(titulo, mensaje, [{ text: 'OK', onPress: callback }]);
    }
  };

  const reproducirSonido = () => {
    try {
      notificationSound.seekTo(0);
      notificationSound.play();
      console.log('🔊 Sonido de notificación reproducido');
    } catch (err) {
      console.log('⚠️ Audio no disponible:', err?.message || err);
    }
  };

  const handleRecoverPassword = async () => {
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }
    if (!validateEmail(email)) {
      setError('Ingresa un correo electrónico válido');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const templateParams = {
        to_email: email,
        message: 'Haz clic en el enlace para recuperar tu contraseña',
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('📧 Correo enviado exitosamente a:', email);

      // 🔊 Reproducir sonido al enviar exitosamente
      reproducirSonido();

      setSuccess(true);
      setLoading(false);

      mostrarAlerta(
        'Correo enviado',
        `Revisa tu bandeja de entrada en:\n\n${email}\n\n(Revisa también la carpeta de spam)`,
        () => navigation.navigate('Login')
      );
    } catch (err) {
      console.error('❌ Error al enviar correo:', err);
      setLoading(false);
      setError('No se pudo enviar el correo. Verifica tu conexión e intenta de nuevo.');
    }
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
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>{success ? '✅' : '🔒'}</Text>
              </View>
              <Text style={styles.title}>Recuperar contraseña</Text>
              <Text style={styles.subtitle}>
                Ingresa el correo asociado a tu cuenta de GAMELOG y te enviaremos
                un enlace para restablecer tu contraseña.
              </Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Correo electrónico"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError('');
                }}
                placeholder="ejemplo@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={error}
              />

              <Button
                title="Recuperar contraseña"
                onPress={handleRecoverPassword}
                loading={loading}
              />
            </View>

            <TouchableOpacity
              style={styles.backContainer}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>← Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  header: { alignItems: 'center', marginBottom: 28 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: { fontSize: 36 },
  title: { ...FONTS.title, textAlign: 'center', marginBottom: 12 },
  subtitle: {
    ...FONTS.subtitle,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  form: { marginBottom: 20 },
  backContainer: { alignItems: 'center', marginTop: 8 },
  backText: { color: COLORS.primary, fontSize: 15, fontWeight: '600' },
});