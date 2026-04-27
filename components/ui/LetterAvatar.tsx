import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LetterAvatarProps {
  name: string;
  size?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function LetterAvatar({ name, size = 50, style, textStyle }: LetterAvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  
  // Generate a consistent color based on the name
  const colors = [
    ['#1A73E8', '#4285F4'], // Blue
    ['#34A853', '#0F9D58'], // Green
    ['#FBBC05', '#F4B400'], // Yellow
    ['#EA4335', '#D93025'], // Red
    ['#673AB7', '#512DA8'], // Purple
    ['#FF5722', '#E64A19'], // Orange
  ];
  
  const charCode = initial.charCodeAt(0);
  const colorIndex = charCode % colors.length;
  const selectedColors = colors[colorIndex] as readonly [string, string];

  return (
    <LinearGradient
      colors={selectedColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container, 
        { width: size, height: size, borderRadius: size / 2 }, 
        style
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.45 }, textStyle]}>
        {initial}
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '900',
  }
});
