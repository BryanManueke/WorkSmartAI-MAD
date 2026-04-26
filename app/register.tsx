import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
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
import { useGoogleAuth } from '../services/googleAuth';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const scrollRef = useRef<ScrollView>(null);
  const [showPass, setShowPass] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const storeUser = useMutation(api.users.storeUser);
  const registerMutation = useMutation(api.users.create);
  const { loginWithGoogle, userInfo, loading: googleLoading, error: googleError } = useGoogleAuth();

  const handleFocus = () => {
    // Scroll to end when focused on lower fields
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    if (userInfo) {
      handleSyncGoogleUser();
    }
  }, [userInfo]);

  useEffect(() => {
    if (googleError) {
      Alert.alert("Gagal Daftar", googleError);
    }
  }, [googleError]);

  const handleSyncGoogleUser = async () => {
    try {
      const userDoc = await storeUser({
        name: userInfo!.name,
        email: userInfo!.email,
        avatar: userInfo!.picture
      });
      
      if (userDoc) {
        setUser({
          ...userDoc,
          id: userDoc._id
        } as any);
        router.replace('/(tabs)/dashboard');
      }
    } catch (e) {
      Alert.alert("Error", "Gagal menyinkronkan data Google ke server.");
    }
  };

  const handleGoogleLogin = async () => {
    // Show system prompt simulation before starting real auth session
    Alert.alert(
      "\"WorkSmartAI\" Ingin Menggunakan \"google.com\" untuk Masuk",
      "Ini memungkinkan aplikasi dan situs web untuk berbagi informasi tentang Anda.",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Lanjutkan", 
          onPress: () => loginWithGoogle()
        }
      ]
    );
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Data Tidak Lengkap", "Mohon isi seluruh kolom pendaftaran.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Kata Sandi Tidak Cocok", "Pastikan kata sandi dan konfirmasinya sama.");
      return;
    }

    try {
      const userDoc = await registerMutation({ name, email, password });
      
      if (userDoc) {
        setUser({
          ...userDoc,
          id: userDoc._id
        } as any);

        Alert.alert("Sukses Pendaftaran", "Akun Anda berhasil dibuat!", [
          { text: "Mulai Sekarang", onPress: () => router.replace('/(tabs)/dashboard') }
        ]);
      }
    } catch (error: any) {
      let errMsg = error.message || "Gagal mendaftar.";
      if (errMsg.includes("Uncaught Error: ")) {
        errMsg = errMsg.split("Uncaught Error: ")[1].split(" at handler")[0].trim();
      }
      Alert.alert("Gagal Mendaftar", errMsg);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#1A73E8', '#1A73E8']}
        style={styles.headerBackground}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView 
            ref={scrollRef}
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            
            <View style={styles.logoSection}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtnAbsolute}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.logoCircle}>
                <Ionicons name="briefcase" size={40} color="#FFFFFF" />
              </View>
              <Text style={styles.brandName}>WorkSmart<Text style={{color: '#FFFFFF'}}>AI</Text></Text>
              <Text style={styles.brandTagline}>Buat Akun untuk Memulai</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.formSection}>
                <WorkInput 
                  label="Nama Lengkap" 
                  placeholder="Budi Santoso" 
                  value={name} 
                  onChangeText={setName} 
                />
                <WorkInput 
                  label="Email" 
                  placeholder="nama@email.com" 
                  keyboardType="email-address" 
                  value={email} 
                  onChangeText={setEmail} 
                />
                <WorkInput 
                  label="Kata Sandi" 
                  placeholder="••••••••" 
                  secureTextEntry 
                  value={password} 
                  onChangeText={setPassword} 
                  onFocus={handleFocus}
                  showPassword={showPass}
                  onTogglePassword={() => setShowPass(!showPass)}
                />
                <WorkInput 
                  label="Konfirmasi Kata Sandi" 
                  placeholder="••••••••" 
                  secureTextEntry 
                  value={confirmPassword} 
                  onChangeText={setConfirmPassword} 
                  onFocus={handleFocus}
                  showPassword={showPass}
                  hideIcon={true}
                />
                
                <WorkButton 
                  title="Daftar Sekarang" 
                  onPress={handleRegister} 
                  style={styles.registerBtn} 
                />

                <View style={styles.dividerRow}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Atau daftar dengan</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.socialRow}>
                  <TouchableOpacity 
                    style={styles.googleBtn} 
                    onPress={handleGoogleLogin}
                    disabled={googleLoading}
                  >
                    {googleLoading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="logo-google" size={20} color="#DB4437" />
                        <Text style={styles.googleBtnText}>Daftar dengan Google</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Sudah punya akun? </Text>
                <TouchableOpacity onPress={() => router.replace('/')}>
                  <Text style={styles.loginLink}>Masuk di Sini</Text>
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
    marginTop: 0,
    marginBottom: 10,
  },
  logoCircle: {
    width: 60, 
    height: 60, 
    borderRadius: 20, 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 8,
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
  backBtnAbsolute: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  formSection: { 
    width: '100%' 
  },
  registerBtn: { 
    height: 56,
    borderRadius: 18,
    backgroundColor: '#1A73E8',
    marginTop: 12
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
  loginLink: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: '#1A73E8' 
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
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
