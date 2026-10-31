import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Input from '../components/Input';
import Button from '../components/Button';
import { COLORS, SIZES, FONTS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

const LogoGAMELOG = require('../assets/images/logo.png');

export default function LoginScreen({ navigation }) {
  const { iniciarSesion } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const passwordRef = useRef(null);

  const validateEmail = (text) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(text);
  };

  const handleLogin = () => {
    // Limpiar errores previos
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let hasError = false;

    // Validación del correo
    if (!email.trim()) {
      setEmailError('El correo es obligatorio');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Ingresa un correo válido (ej. usuario@correo.com)');
      hasError = true;
    }

    // Validación de la contraseña
    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('La contraseña debe tener mínimo 8 caracteres');
      hasError = true;
    }

    if (hasError) return;

    // Validación de credenciales contra el contexto global
    const resultado = iniciarSesion(email, password);

    if (!resultado.success) {
      setGeneralError(
        'Usuario o contraseña incorrectos. Verifica tus datos o regístrate.'
      );
      return;
    }

    // Login exitoso → ir a pantalla de carga
    console.log('✅ Login exitoso con:', resultado.usuario.email);
    console.log('👤 Bienvenido:', resultado.usuario.nombre);
    navigation.replace('Loading');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={LogoGAMELOG}
            style={styles.logoImage}
            contentFit="contain"
            transition={300}
          />
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        <Input
          label="Correo electrónico"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
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
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) setPasswordError('');
            if (generalError) setGeneralError('');
          }}
          placeholder="••••••••"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={50}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          error={passwordError}
          prefixIcon="🔒"
        />

        {/* Error general de credenciales */}
        {generalError ? (
          <View style={styles.generalErrorBox}>
            <Text style={styles.generalErrorText}>⚠️ {generalError}</Text>
          </View>
        ) : null}

        <Button title="Iniciar sesión" onPress={handleLogin} />

        <TouchableOpacity
          style={styles.forgotContainer}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerContainer}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>
            ¿No tienes cuenta?{' '}
            <Text style={styles.registerLink}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: { alignItems: 'center', marginBottom: 32 },
  logoImage: {
    width: 220,
    height: 300,
    marginBottom: 8,
  },
  subtitle: { ...FONTS.subtitle, marginTop: 8, textAlign: 'center' },
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
  forgotContainer: { alignItems: 'center', marginTop: 20 },
  forgotText: { color: COLORS.primary, fontSize: 15, fontFamily: 'Inter-Bold' },
  registerContainer: { alignItems: 'center', marginTop: 24 },
  registerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  registerLink: { color: COLORS.primary, fontFamily: 'Inter-Bold' },
});