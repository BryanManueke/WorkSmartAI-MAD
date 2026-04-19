import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import WorkInput from '../components/WorkInput';
import WorkButton from '../components/WorkButton';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#202124" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Buat Akun</Text>
            <Text style={styles.subtitle}>Mulai perjalanan karier cerdasmu bersama AI</Text>
          </View>

          <View style={styles.form}>
            <WorkInput label="Nama Lengkap" placeholder="Budi Santoso" />
            <WorkInput label="Email" placeholder="nama@email.com" keyboardType="email-address" />
            <WorkInput label="Kata Sandi" placeholder="••••••••" secureTextEntry />
            <WorkInput label="Konfirmasi Kata Sandi" placeholder="••••••••" secureTextEntry />
            
            <WorkButton title="Buat Akun" onPress={() => router.replace('/setup-profile')} style={styles.mainBtn} />
            
            <View style={styles.centerRow}>
              <Text style={styles.footerText}>Sudah punya akun? </Text>
              <WorkButton title="Masuk" variant="link" onPress={() => router.replace('/login')} />
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 20,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#202124',
  },
  subtitle: {
    fontSize: 16,
    color: '#5F6368',
    marginTop: 8,
    fontWeight: '500',
  },
  form: {
    width: '100%',
  },
  mainBtn: {
    marginTop: 10,
    marginBottom: 20,
  },
  centerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  footerText: {
    color: '#5F6368',
    fontSize: 15,
  }
});
