import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label: string;
  marginBottom?: number;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  hideIcon?: boolean;
}

export default function WorkInput({ 
  label, 
  secureTextEntry, 
  marginBottom = 12, 
  showPassword, 
  onTogglePassword,
  hideIcon,
  ...props 
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalShowPassword, setInternalShowPassword] = useState(false);

  // Gunakan prop showPassword jika ada, jika tidak gunakan state internal
  const isPasswordVisible = showPassword !== undefined ? showPassword : internalShowPassword;
  const isSecure = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, { marginBottom }]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputBox, isFocused && styles.inputFocused]}>
        <TextInput
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9AA0A6"
          secureTextEntry={isSecure}
          {...props}
        />
        {secureTextEntry && !hideIcon && (
          <TouchableOpacity 
            style={styles.iconContainer} 
            onPress={onTogglePassword || (() => setInternalShowPassword(!internalShowPassword))}
          >
            <Ionicons 
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
              size={20} 
              color="#5F6368" 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3C4043',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputBox: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: '#F1F3F4',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputFocused: {
    borderColor: '#1A73E8',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#202124',
    height: '100%',
  },
  iconContainer: {
    padding: 4,
  }
});
