import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'social' | 'link';
  style?: ViewStyle;
}

export default function WorkButton({ title, onPress, variant = 'primary', style }: ButtonProps) {
  if (variant === 'link') {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.linkBtn, style]}>
        <Text style={styles.linkText}>{title}</Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'social') {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.socialBtn, style]} activeOpacity={0.8}>
        <Text style={styles.socialText}>{title}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.btnShadow, style]}>
      <LinearGradient
        colors={['#1A73E8', '#1A73E8']}
        style={styles.primaryBtn}
      >
        <Text style={styles.primaryText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnShadow: {
    width: '100%',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryBtn: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  socialBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#E8EAED',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: {
    color: '#3C4043',
    fontSize: 15,
    fontWeight: '600',
  },
  linkBtn: {
    paddingVertical: 8,
  },
  linkText: {
    color: '#1A73E8',
    fontSize: 14,
    fontWeight: '600',
  }
});
