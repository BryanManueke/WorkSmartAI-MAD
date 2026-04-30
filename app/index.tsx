import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { LinearGradient } from 'expo-linear-gradient';

import WorkInput from '../components/ui/WorkInput';
import WorkButton from '../components/ui/WorkButton';
import { useUserStore } from '../stores';
import { ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const loginMutation = useMutation(api.users.login);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Input Kosong", "Mohon masukkan email dan kata sandi.");
      return;
    }

    try {
      setIsProcessing(true);
      console.log("Memulai loginMutation...");
      const userDoc = await loginMutation({ email, password });
      console.log("loginMutation selesai:", userDoc ? "Sukses" : "Gagal");
      
      if (!userDoc) {
        throw new Error("Gagal mengambil profil akun.");
      }

      console.log("Setting user store...");
      setUser({
        ...userDoc,
        id: userDoc._id
      } as any);

      console.log("Navigasi ke dashboard...");
      router.replace('/(tabs)/dashboard');
    } catch (error: any) {
      console.error("Login Error:", error);
      let errMsg = error.message || "Kredensial salah.";
      if (errMsg.includes("Uncaught Error: ")) {
        errMsg = errMsg.split("Uncaught Error: ")[1].split(" at handler")[0].trim();
      } else {
        errMsg = errMsg.replace(/\[.*?\]\s*/g, '');
      }
      Alert.alert("Gagal Masuk", errMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Accent */}
      <LinearGradient
        colors={['#1A73E8', '#1A73E8']}
        style={styles.headerBackground}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            
            <View style={styles.logoSection}>
              <View style={styles.logoCircle}>
                <Ionicons name="briefcase" size={40} color="#FFFFFF" />
              </View>
              <Text style={styles.brandName}>WorkSmart<Text style={{color: '#FFFFFF'}}>AI</Text></Text>
              <Text style={styles.brandTagline}>Temukan Karier Impianmu</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.formSection}>
                <WorkInput 
                  label="Email" 
                  placeholder="nama@email.com" 
                  keyboardType="email-address" 
                  value={email}
                  onChangeText={setEmail}
                  marginBottom={20}
                />
                <WorkInput 
                  label="Kata Sandi" 
                  placeholder="••••••••" 
                  secureTextEntry 
                  value={password}
                  onChangeText={setPassword}
                  marginBottom={20}
                />
                
                <TouchableOpacity style={styles.forgotBtn}>
                  <Text style={styles.forgotText}>Lupa Kata Sandi?</Text>
                </TouchableOpacity>

                <WorkButton 
                  title={isProcessing ? "Memproses..." : "Masuk ke Akun"} 
                  onPress={handleLogin} 
                  loading={isProcessing}
                />
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Belum punya akun? </Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Text style={styles.registerLink}>Daftar Sekarang</Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 20 
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  logoCircle: {
    width: 80, 
    height: 80, 
    borderRadius: 24, 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  brandName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  brandTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  formSection: { 
    width: '100%' 
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: '600'
  },
  loginBtn: { 
    height: 56,
    borderRadius: 18,
    backgroundColor: '#1A73E8',
  },

  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 24 
  },
  footerText: { 
    fontSize: 15, 
    color: '#5F6368' 
  },
  registerLink: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: '#1A73E8' 
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F3F4',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9AA0A6',
    fontSize: 13,
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'column',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#F1F3F4',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  googleBtnText: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '700',
    color: '#202124',
  },
});
