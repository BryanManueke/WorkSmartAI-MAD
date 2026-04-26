import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Platform,
  View
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function AIFloatingChat() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide on certain pages if needed
  const hideOn = ['/ai-chat', '/index', '/register', '/'];
  if (hideOn.includes(pathname)) return null;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => router.push('/ai-chat')}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['#1A73E8', '#00C896']}
        style={styles.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name="sparkles" size={24} color="#FFFFFF" />
        <View style={styles.badge} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    zIndex: 999,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF5252',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  }
});
