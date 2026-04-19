import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import WorkInput from '../components/WorkInput';
import WorkButton from '../components/WorkButton';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Selamat Datang!</Text>
            <Text style={styles.subtitle}>Masuk untuk mulai perjalanan kariermu</Text>
          </View>

          <View style={styles.form}>
            <WorkInput label="Email" placeholder="nama@email.com" keyboardType="email-address" />
            <WorkInput label="Kata Sandi" placeholder="••••••••" secureTextEntry />
            
            <WorkButton title="Masuk" onPress={() => router.replace('/(tabs)/dashboard')} style={styles.mainBtn} />
            
            <View style={styles.centerRow}>
              <Text style={styles.footerText}>Belum punya akun? </Text>
              <WorkButton title="Daftar Sekarang" variant="link" onPress={() => router.push('/register')} />
            </View>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Atau masuk dengan</Text>
              <View style={styles.divider} />
            </View>

            <WorkButton title="Google" variant="social" onPress={() => {}} />
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
    paddingTop: 60,
  },
  header: {
    marginBottom: 48,
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
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F3F4',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9AA0A6',
    fontWeight: '600',
    fontSize: 13,
  }
});
