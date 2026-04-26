import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useMutation } from 'convex/react';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import WorkButton from '../components/ui/WorkButton';
import WorkInput from '../components/ui/WorkInput';
import { api } from '../convex/_generated/api';
import { CATEGORIES } from '../data/jobs';

export default function AddJobScreen() {
  const router = useRouter();
  const createJob = useMutation(api.jobs.createJob);

  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Manado');
  const [salary, setSalary] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [type, setType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [responsibilities, setResponsibilities] = useState('');

  const handleSubmit = async () => {
    if (!title || !company || !salary || !description) {
      Alert.alert("Error", "Mohon lengkapi data utama.");
      return;
    }

    try {
      await createJob({
        title,
        company,
        location,
        salary,
        category,
        type,
        logo: "briefcase", // Default logo
        banner: "tech", // Default banner
        description,
        requirements: requirements.split('\n').filter(r => r.trim() !== ''),
        responsibilities: responsibilities.split('\n').filter(r => r.trim() !== ''),
      });

      Alert.alert("Sukses", "Lowongan berhasil dipublikasikan!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (e) {
      Alert.alert("Error", "Gagal menyimpan lowongan.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color="#202124" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tambah Lowongan</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <WorkInput label="Judul Pekerjaan" placeholder="Contoh: Frontend Developer" value={title} onChangeText={setTitle} />
        <WorkInput label="Nama Perusahaan" placeholder="Contoh: PT Teknologi Maju" value={company} onChangeText={setCompany} />

        <Text style={styles.label}>Kategori</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={category} onValueChange={setCategory}>
            {CATEGORIES.map(cat => (
              <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Tipe Pekerjaan</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={type} onValueChange={setType}>
            <Picker.Item label="Full-time" value="Full-time" />
            <Picker.Item label="Part-time" value="Part-time" />
            <Picker.Item label="Magang" value="Magang" />
            <Picker.Item label="Kontrak" value="Kontrak" />
          </Picker>
        </View>

        <WorkInput label="Gaji" placeholder="Contoh: Rp 5 - 8 Jt" value={salary} onChangeText={setSalary} />
        <WorkInput label="Lokasi" placeholder="Contoh: Manado" value={location} onChangeText={setLocation} />

        <Text style={styles.label}>Deskripsi Pekerjaan</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Tulis deskripsi pekerjaan..."
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Persyaratan (Satu per baris)</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Lulusan S1..."
          value={requirements}
          onChangeText={setRequirements}
        />

        <Text style={styles.label}>Tanggung Jawab (Satu per baris)</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Mengelola website..."
          value={responsibilities}
          onChangeText={setResponsibilities}
        />

        <WorkButton title="Publikasikan Lowongan" onPress={handleSubmit} style={styles.submitBtn} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#202124' },
  scrollContent: { padding: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#5F6368', marginBottom: 8, marginTop: 16 },
  pickerContainer: { backgroundColor: '#F8F9FA', borderRadius: 16, borderWidth: 1.5, borderColor: '#F1F3F4', overflow: 'hidden' },
  textArea: { backgroundColor: '#F8F9FA', borderRadius: 16, borderWidth: 1.5, borderColor: '#F1F3F4', padding: 16, fontSize: 15, textAlignVertical: 'top', minHeight: 100 },
  submitBtn: { marginTop: 32, marginBottom: 40 }
});
