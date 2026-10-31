import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, FONTS } from '../utils/theme';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  secureTextEntry = false,
  maxLength,
  editable = true,
  error,
  onFocus,
  onBlur,
  returnKeyType = 'next',
  onSubmitEditing,
  inputRef,
  selectionColor = COLORS.primary,
}) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          error ? styles.inputError : null,
          !editable ? styles.inputDisabled : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        secureTextEntry={secureTextEntry}
        maxLength={maxLength}
        editable={editable}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
        onBlur={onBlur}
        selectionColor={selectionColor}
        underlineColorAndroid="transparent"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    ...FONTS.body,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: SIZES.inputHeight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: '#FFEBEE',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    color: COLORS.textSecondary,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
});