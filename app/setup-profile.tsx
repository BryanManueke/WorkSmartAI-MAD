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
  Platform,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

import WorkInput from '@/components/ui/WorkInput';
import WorkButton from '@/components/ui/WorkButton';
import { useUserStore } from '@/stores';

const { width } = Dimensions.get('window');

export default function SetupProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const updateProfileMutation = useMutation(api.users.updateProfile);

  // --- FORM STATE ---
  // Step 1: Data Pribadi
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const [name, setName] = useState(user?.name || '');
  const [dob, setDob] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan' | ''>('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Manado'); // default

  // Step 2: Pendidikan
  const [educationLevel, setEducationLevel] = useState('S1');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [gradYear, setGradYear] = useState('2024');

  // Step 3: Keahlian & Pengalaman
  const [status, setStatus] = useState<'Fresh Graduate' | 'Punya Pengalaman Kerja' | ''>('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [workPeriod, setWorkPeriod] = useState('');
  
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const suggestedSkills = ['React Native', 'JavaScript', 'Python', 'SQL', 'Figma', 'Excel', 'Kotlin', 'PHP'];

  // Step 4: Preferensi Karier
  const [fieldOfInterest, setFieldOfInterest] = useState('');
  const fields = ['Teknologi', 'Bisnis', 'Desain', 'Marketing', 'Kesehatan', 'Pendidikan'];
  const [jobType, setJobType] = useState('Full-time');
  const [workLocation, setWorkLocation] = useState('Manado');
  const [salaryExpectation, setSalaryExpectation] = useState(5); // in millions, default 5jt

  // --- ACTIONS ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    // Validation
    if (step === 1) {
      if (!name.trim() || !gender || !phone.trim() || !city.trim() || !dob) {
        Alert.alert('Data Tidak Lengkap', 'Harap isi semua kolom wajib pada Data Pribadi.');
        return;
      }
    } else if (step === 2) {
      if (!educationLevel || !university.trim() || !major.trim() || !gradYear) {
        Alert.alert('Data Tidak Lengkap', 'Harap isi semua kolom Pendidikan.');
        return;
      }
    } else if (step === 3) {
      if (!status) {
        Alert.alert('Data Tidak Lengkap', 'Pilih status pengalaman Anda.');
        return;
      }
      if (status === 'Punya Pengalaman Kerja' && (!company.trim() || !position.trim() || !workPeriod.trim())) {
        Alert.alert('Data Tidak Lengkap', 'Harap lengkapi data pengalaman kerja terakhir.');
        return;
      }
      if (skills.length === 0) {
        Alert.alert('Data Tidak Lengkap', 'Tambahkan minimal 1 keahlian/skill.');
        return;
      }
    } else if (step === 4) {
      if (!fieldOfInterest) {
        Alert.alert('Data Tidak Lengkap', 'Pilih 1 bidang pekerjaan yang paling diminati.');
        return;
      }
      handleFinish();
      return;
    }

    setStep(step + 1);
  };

  const handleFinish = async () => {
    if (!user?._id) {
       Alert.alert("Error System", "ID User tidak valid. Silakan relogin.");
       return;
    }

    try {
      const userRef = user._id as any; 
      // Simpan semua data ke Convex nyata
      const updatedUser = await updateProfileMutation({
        userId: userRef,
        name,
        avatar: avatar || undefined,
        location: city,
        phone,
        dob: dob.toISOString(),
        gender,
        university,
        major,
        gradYear,
        skills,
        status,
        preferredJobType: jobType,
        targetLocation: workLocation,
        salaryExpectation
      });

      // Update local global store
      setUser({
        ...updatedUser,
        id: updatedUser?._id
      } as any);

      Alert.alert('Berhasil', 'Profil Anda telah disinkronkan ke Database Convex Sukses!', [
        { text: 'Selesai', onPress: () => router.replace('/(tabs)/dashboard') }
      ]);
    } catch (error: any) {
      Alert.alert("Gagal Sinkronisasi", error.message || "Mohon cek koneksi");
    }
  };

  // --- HELPERS ---
  const handleAddSkill = (skillToAdd: string) => {
    const s = skillToAdd.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDob(selectedDate);
  };

  // --- RENDERERS ---
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

          {/* STEP 1 */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Data Pribadi</Text>
              
              <TouchableOpacity style={styles.avatarUpload} onPress={pickImage}>
                <View style={[styles.avatarCircle, avatar ? { padding: 0 } : {}]}>
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatarImg} />
                  ) : (
                    <Ionicons name="camera-outline" size={30} color="#1A73E8" />
                  )}
                </View>
                <Text style={styles.uploadText}>{avatar ? "Ubah Foto" : "Unggah Foto Profil (Opsional)"}</Text>
              </TouchableOpacity>

              <WorkInput label="Nama Lengkap *" placeholder="Masukkan nama lengkap" value={name} onChangeText={setName} />
              
              <Text style={styles.label}>Tanggal Lahir *</Text>
              <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.datePickerText}>{dob.toLocaleDateString('id-ID')}</Text>
                <Ionicons name="calendar-outline" size={20} color="#5F6368" />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker value={dob} mode="date" display="default" onChange={onChangeDate} />
              )}

              <Text style={[styles.label, { marginTop: 16, marginBottom: 8 }]}>Jenis Kelamin *</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity style={styles.radioOption} onPress={() => setGender('Laki-laki')}>
                  <Ionicons name={gender === 'Laki-laki' ? 'radio-button-on' : 'radio-button-off'} size={24} color={gender === 'Laki-laki' ? '#1A73E8' : '#9AA0A6'} />
                  <Text style={styles.radioText}>Laki-laki</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.radioOption} onPress={() => setGender('Perempuan')}>
                  <Ionicons name={gender === 'Perempuan' ? 'radio-button-on' : 'radio-button-off'} size={24} color={gender === 'Perempuan' ? '#1A73E8' : '#9AA0A6'} />
                  <Text style={styles.radioText}>Perempuan</Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 12 }}>
                <WorkInput label="Nomor Telepon *" placeholder="Contoh: 08123456789" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
                <WorkInput label="Kota Domisili *" placeholder="Contoh: Manado" value={city} onChangeText={setCity} />
              </View>
            </View>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Pendidikan</Text>
              
              <Text style={styles.label}>Tingkat Pendidikan *</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={educationLevel} onValueChange={(v) => setEducationLevel(v)}>
                  <Picker.Item label="SMA/SMK" value="SMA/SMK" />
                  <Picker.Item label="D3" value="D3" />
                  <Picker.Item label="D4" value="D4" />
                  <Picker.Item label="S1" value="S1" />
                  <Picker.Item label="S2" value="S2" />
                </Picker>
              </View>

              <WorkInput label="Nama Universitas / Sekolah *" placeholder="Contoh: Universitas Indonesia" value={university} onChangeText={setUniversity} />
              <WorkInput label="Jurusan *" placeholder="Contoh: Teknik Informatika" value={major} onChangeText={setMajor} />
              
              <Text style={styles.label}>Tahun Lulus *</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={gradYear} onValueChange={(v) => setGradYear(v)}>
                  {Array.from({ length: 40 }, (_, i) => new Date().getFullYear() + 4 - i).map(y => (
                    <Picker.Item key={y.toString()} label={y.toString()} value={y.toString()} />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Keahlian & Pengalaman</Text>
              
              <Text style={[styles.label, { marginBottom: 8 }]}>Status Pengalaman Kerja *</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity style={styles.radioOption} onPress={() => setStatus('Fresh Graduate')}>
                  <Ionicons name={status === 'Fresh Graduate' ? 'radio-button-on' : 'radio-button-off'} size={24} color={status === 'Fresh Graduate' ? '#00C896' : '#9AA0A6'} />
                  <Text style={styles.radioText}>Fresh Graduate</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.radioGroup, { marginTop: 0 }]}>
                <TouchableOpacity style={styles.radioOption} onPress={() => setStatus('Punya Pengalaman Kerja')}>
                  <Ionicons name={status === 'Punya Pengalaman Kerja' ? 'radio-button-on' : 'radio-button-off'} size={24} color={status === 'Punya Pengalaman Kerja' ? '#00C896' : '#9AA0A6'} />
                  <Text style={styles.radioText}>Punya Pengalaman Kerja</Text>
                </TouchableOpacity>
              </View>

              {status === 'Punya Pengalaman Kerja' && (
                <View style={styles.subForm}>
                  <WorkInput label="Nama Perusahaan Terakhir" placeholder="Contoh: PT Teknologi Bangsa" value={company} onChangeText={setCompany} />
                  <WorkInput label="Posisi / Jabatan" placeholder="Contoh: Frontend Developer" value={position} onChangeText={setPosition} />
                  <WorkInput label="Periode Bekerja" placeholder="Contoh: 2021 - 2023" value={workPeriod} onChangeText={setWorkPeriod} />
                </View>
              )}

              <Text style={[styles.label, { marginTop: 20 }]}>Skill Teknis / Soft Skill (Min 1) *</Text>
              <View style={styles.skillInputRow}>
                <TextInput 
                  style={styles.skillInput} 
                  placeholder="Ketik skill lalu tambah..." 
                  value={newSkill}
                  onChangeText={setNewSkill}
                  onSubmitEditing={() => handleAddSkill(newSkill)}
                />
                <TouchableOpacity onPress={() => handleAddSkill(newSkill)} style={styles.addBtn}>
                  <Ionicons name="add" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.subLabel}>Saran (Klik untuk tambah):</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                {suggestedSkills.map(s => (
                  !skills.includes(s) && (
                    <TouchableOpacity key={s} style={styles.suggestionTag} onPress={() => handleAddSkill(s)}>
                      <Text style={styles.suggestionTagText}>+ {s}</Text>
                    </TouchableOpacity>
                  )
                ))}
              </ScrollView>

              <View style={styles.tagContainer}>
                {skills.map((skill, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{skill}</Text>
                    <TouchableOpacity onPress={() => handleRemoveSkill(skill)}>
                      <Ionicons name="close-circle" size={18} color="#1A73E8" style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Preferensi Karier</Text>
              
              <Text style={[styles.label, { marginBottom: 8 }]}>Bidang Pekerjaan (Pilih 1) *</Text>
              <View style={styles.tagContainer}>
                {fields.map(f => (
                  <TouchableOpacity 
                    key={f} 
                    style={[styles.fieldTag, fieldOfInterest === f && styles.fieldTagActive]}
                    onPress={() => setFieldOfInterest(f)}
                  >
                    <Text style={[styles.fieldTagText, fieldOfInterest === f && styles.fieldTagTextActive]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { marginTop: 12 }]}>Jenis Pekerjaan</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={jobType} onValueChange={setJobType}>
                  <Picker.Item label="Full-time" value="Full-time" />
                  <Picker.Item label="Part-time" value="Part-time" />
                  <Picker.Item label="Magang" value="Magang" />
                </Picker>
              </View>

              <Text style={styles.label}>Lokasi Kerja</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={workLocation} onValueChange={setWorkLocation}>
                  <Picker.Item label="Manado" value="Manado" />
                  <Picker.Item label="Remote" value="Remote" />
                  <Picker.Item label="Hybrid" value="Hybrid" />
                </Picker>
              </View>

              <View style={styles.sliderContainer}>
                <Text style={styles.label}>Ekspektasi Gaji (Per Bulan)</Text>
                <Text style={styles.salaryValue}>Rp {salaryExpectation} Juta</Text>
                
                <Slider
                  style={{ width: '100%', height: 40, marginTop: 10 }}
                  minimumValue={3}
                  maximumValue={20}
                  step={1}
                  value={salaryExpectation}
                  onValueChange={setSalaryExpectation}
                  minimumTrackTintColor="#1A73E8"
                  maximumTrackTintColor="#E8EAED"
                  thumbTintColor="#1A73E8"
                />
                <View style={styles.rowSpace}>
                  <Text style={styles.salaryLimit}>Rp 3 Juta</Text>
                  <Text style={styles.salaryLimit}>Rp 20 Juta</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.footer}>
            {step > 1 && (
              <WorkButton 
                title="Kembali" 
                variant="social" 
                onPress={() => setStep(step - 1)} 
                style={{ flex: 1, marginRight: 12, borderWidth: 0, backgroundColor: '#F1F3F4' }} 
              />
            )}
            <WorkButton 
              title={step === totalSteps ? "Selesaikan Profil" : "Lanjut"} 
              onPress={handleNext} 
              style={{ flex: step > 1 ? 2 : 1 }}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 24, paddingTop: 10, paddingBottom: 40 },
  backBtn: { padding: 8, marginLeft: -8, marginBottom: 16 },
  progressContainer: { marginBottom: 32 },
  progressBar: { height: 6, backgroundColor: '#F1F3F4', borderRadius: 3, marginBottom: 10, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#1A73E8' },
  progressText: { fontSize: 13, fontWeight: '700', color: '#5F6368' },
  stepContainer: { width: '100%' },
  stepTitle: { fontSize: 28, fontWeight: '900', color: '#202124', marginBottom: 28 },
  label: { fontSize: 14, fontWeight: '600', color: '#3C4043', marginBottom: 6 },
  subLabel: { fontSize: 13, color: '#9AA0A6', marginBottom: 8 },
  avatarUpload: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#E8F1FF', justifyContent: 'center', alignItems: 'center', marginBottom: 12, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  uploadText: { fontSize: 14, color: '#1A73E8', fontWeight: '600' },
  datePickerBtn: { flex: 1, height: 56, backgroundColor: '#F8F9FA', borderRadius: 16, borderWidth: 1.5, borderColor: '#F1F3F4', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  datePickerText: { fontSize: 16, color: '#202124' },
  radioGroup: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  radioText: { fontSize: 15, color: '#3C4043', marginLeft: 8, fontWeight: '500' },
  pickerContainer: { backgroundColor: '#F8F9FA', borderRadius: 16, borderWidth: 1.5, borderColor: '#F1F3F4', marginBottom: 16, overflow: 'hidden' },
  subForm: { backgroundColor: '#F8F9FA', padding: 16, borderRadius: 16, marginTop: 10, marginBottom: 10 },
  skillInputRow: { flexDirection: 'row', marginBottom: 12 },
  skillInput: { flex: 1, height: 56, backgroundColor: '#F8F9FA', borderWidth: 1.5, borderColor: '#F1F3F4', borderRadius: 16, paddingHorizontal: 16, fontSize: 15, marginRight: 12 },
  addBtn: { width: 56, height: 56, backgroundColor: '#1A73E8', borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F1FF', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 30, marginRight: 8, marginBottom: 10 },
  tagText: { fontSize: 14, color: '#1A73E8', fontWeight: '700' },
  suggestionTag: { backgroundColor: '#F1F3F4', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  suggestionTagText: { fontSize: 13, color: '#5F6368', fontWeight: '600' },
  fieldTag: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#E8EAED', marginRight: 10, marginBottom: 12 },
  fieldTagActive: { backgroundColor: '#1A73E8', borderColor: '#1A73E8' },
  fieldTagText: { fontSize: 14, color: '#5F6368', fontWeight: '600' },
  fieldTagTextActive: { color: '#FFFFFF' },
  sliderContainer: { marginTop: 20 },
  rowSpace: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  salaryValue: { fontSize: 28, fontWeight: '900', color: '#1A73E8', marginTop: 4 },
  salaryLimit: { fontSize: 12, color: '#9AA0A6', fontWeight: '600', marginTop: -4 },
  footer: { flexDirection: 'row', marginTop: 40, paddingBottom: 20 },
});
