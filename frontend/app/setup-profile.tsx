import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import WorkInput from '../components/WorkInput';
import WorkButton from '../components/WorkButton';

const { width } = Dimensions.get('window');

export default function SetupProfileScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form State
  const [skills, setSkills] = useState(['JavaScript', 'Desain UI']);
  const [newSkill, setNewSkill] = useState('');
  const [salary, setSalary] = useState(10); // in millions

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else router.replace('/(tabs)/dashboard');
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / totalSteps) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>Langkah {step} dari {totalSteps}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="close" size={24} color="#202124" />
          </TouchableOpacity>

          {renderProgress()}

          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Data Pribadi</Text>
              <TouchableOpacity style={styles.avatarUpload}>
                <View style={styles.avatarCircle}>
                  <Ionicons name="camera-outline" size={30} color="#1A73E8" />
                </View>
                <Text style={styles.uploadText}>Unggah Foto Profil</Text>
              </TouchableOpacity>
              <WorkInput label="Nama Lengkap" placeholder="Masukkan nama lengkap" />
              <WorkInput label="Nomor Telepon" placeholder="0812xxxx" keyboardType="phone-pad" />
              <WorkInput label="Kota" placeholder="Contoh: Jakarta" />
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Pendidikan</Text>
              <WorkInput label="Universitas" placeholder="Nama Universitas" />
              <WorkInput label="Jurusan" placeholder="Contoh: Teknik Informatika" />
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <WorkInput label="Tahun Lulus" placeholder="2024" keyboardType="numeric" />
                </View>
                <View style={{ flex: 1 }}>
                  <WorkInput label="IPK" placeholder="3.80" keyboardType="numeric" />
                </View>
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Keahlian</Text>
              <Text style={styles.stepSubtitle}>Tambahkan keahlian yang relevan dengan kariermu</Text>
              
              <View style={styles.skillInputRow}>
                <TextInput 
                  style={styles.skillInput} 
                  placeholder="Tambah keahlian..." 
                  value={newSkill}
                  onChangeText={setNewSkill}
                  onSubmitEditing={addSkill}
                />
                <TouchableOpacity onPress={addSkill} style={styles.addBtn}>
                  <Ionicons name="add" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.tagContainer}>
                {skills.map((skill, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{skill}</Text>
                    <TouchableOpacity onPress={() => removeSkill(skill)}>
                      <Ionicons name="close-circle" size={18} color="#1A73E8" style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Preferensi Kerja</Text>
              
              <WorkInput label="Jenis Pekerjaan" placeholder="Pilih Jenis (Full-time, Magang...)" />
              <WorkInput label="Lokasi Diinginkan" placeholder="Contoh: Jakarta atau Remote" />

              <View style={styles.sliderContainer}>
                <View style={styles.rowSpace}>
                  <Text style={styles.label}>Ekspektasi Gaji</Text>
                  <Text style={styles.salaryValue}>Rp {salary} Jt+</Text>
                </View>
                <View style={styles.dummySlider}>
                  <View style={[styles.sliderFill, { width: `${(salary / 50) * 100}%` }]} />
                  <View style={[styles.sliderThumb, { left: `${(salary / 50) * 100}%` }]} />
                </View>
                <View style={styles.rowSpace}>
                  <Text style={styles.salaryLimit}>Rp 2 Jt</Text>
                  <Text style={styles.salaryLimit}>Rp 50 Jt</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.footer}>
            {step > 1 && (
              <WorkButton 
                title="Kembali" 
                variant="social" 
                onPress={prevStep} 
                style={{ flex: 1, marginRight: 12, borderWidth: 0, backgroundColor: '#F1F3F4' }} 
              />
            )}
            <WorkButton 
              title={step === totalSteps ? "Selesaikan Profil" : "Lanjutkan"} 
              onPress={nextStep} 
              style={{ flex: step > 1 ? 2 : 1 }}
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
  scrollContent: {
    padding: 24,
    paddingTop: 10,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F1F3F4',
    borderRadius: 3,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1A73E8',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5F6368',
  },
  stepContainer: {
    width: '100%',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#202124',
    marginBottom: 32,
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#5F6368',
    marginBottom: 24,
    marginTop: -24,
  },
  avatarUpload: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
  },
  skillInputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  skillInput: {
    flex: 1,
    height: 56,
    backgroundColor: '#F8F9FA',
    borderWidth: 1.5,
    borderColor: '#F1F3F4',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    marginRight: 12,
  },
  addBtn: {
    width: 56,
    height: 56,
    backgroundColor: '#1A73E8',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F1FF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 8,
    marginBottom: 12,
  },
  tagText: {
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: '700',
  },
  sliderContainer: {
    marginTop: 20,
  },
  rowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3C4043',
  },
  salaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A73E8',
  },
  dummySlider: {
    height: 6,
    backgroundColor: '#F1F3F4',
    borderRadius: 3,
    marginVertical: 24,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#1A73E8',
    borderRadius: 3,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#1A73E8',
    position: 'absolute',
    marginLeft: -12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  salaryLimit: {
    fontSize: 12,
    color: '#9AA0A6',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 60,
    paddingBottom: 20,
  }
});
