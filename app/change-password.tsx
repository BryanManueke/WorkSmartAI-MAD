import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUserStore } from '@/stores';
import WorkInput from '@/components/ui/WorkInput';
import WorkButton from '@/components/ui/WorkButton';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const updatePassword = useMutation(api.users.updatePassword);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Mohon isi semua kolom.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Kata sandi baru minimal 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword({
        userId: user?._id as any,
        oldPassword,
        newPassword
      });
      Alert.alert("Sukses", "Kata sandi berhasil diubah!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      let errMsg = error.message || "Gagal mengubah kata sandi.";
      if (errMsg.includes("Uncaught Error: ")) {
        errMsg = errMsg.split("Uncaught Error: ")[1].split(" at handler")[0].trim();
      }
      Alert.alert("Gagal", errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#202124" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Keamanan Akun</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.infoBox}>
            <Ionicons name="shield-checkmark" size={40} color="#1A73E8" />
            <Text style={styles.infoTitle}>Ubah Kata Sandi</Text>
            <Text style={styles.infoDesc}>
              Pastikan kata sandi baru Anda kuat dan tidak mudah menebak.
            </Text>
          </View>

          <View style={styles.form}>
            <WorkInput 
              label="Kata Sandi Lama" 
              placeholder="Masukkan kata sandi saat ini" 
              secureTextEntry 
              value={oldPassword}
              onChangeText={setOldPassword}
            />
            <WorkInput 
              label="Kata Sandi Baru" 
              placeholder="Minimal 6 karakter" 
              secureTextEntry 
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <WorkInput 
              label="Konfirmasi Kata Sandi Baru" 
              placeholder="Ulangi kata sandi baru" 
              secureTextEntry 
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <WorkButton 
              title="Perbarui Kata Sandi" 
              onPress={handleUpdate} 
              loading={loading}
              style={styles.submitBtn} 
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
    paddingTop: Platform.OS === 'android' ? 40 : 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#202124',
  },
  scrollContent: {
    padding: 24,
  },
  infoBox: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#202124',
    marginTop: 12,
  },
  infoDesc: {
    fontSize: 14,
    color: '#5F6368',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  form: {
    width: '100%',
  },
  submitBtn: {
    marginTop: 24,
  }
});
