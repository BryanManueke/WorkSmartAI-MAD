import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
}

export default function WorkInput({ label, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputBox, isFocused && styles.inputFocused]}>
        <TextInput
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9AA0A6"
          {...props}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
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
    justifyContent: 'center',
  },
  inputFocused: {
    borderColor: '#1A73E8',
    backgroundColor: '#FFFFFF',
  },
  input: {
    fontSize: 15,
    color: '#202124',
  }
});
