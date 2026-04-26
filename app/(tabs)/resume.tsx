import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import WorkButton from '@/components/ui/WorkButton';
import WorkInput from '@/components/ui/WorkInput';
import { useUserStore } from '@/stores';
import { useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useEffect } from 'react';

export default function Resume() {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  
  // Convex Hooks
  // Only query if user._id exists to avoid Convex errors
  const userFromDB = useQuery(api.users.getProfile, user?._id ? { userId: user._id as any } : "skip" as any);
  const updateProfile = useMutation(api.users.updateProfile);

  // Detailed Form State
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: (user as any)?.phone || '',
    location: (user as any)?.location || '',
    website: (user as any)?.website || ''
  });

  const [summary, setSummary] = useState((user as any)?.summary || '');
  const [edu, setEdu] = useState(() => {
    try { 
      const data = (user as any)?.education;
      return data ? (JSON.parse(data) || { school: '', degree: '', year: '' }) : { school: '', degree: '', year: '' }; 
    } catch(e) { 
      return { school: '', degree: '', year: '' }; 
    }
  });
  const [exp, setExp] = useState(() => {
    try { 
      const data = (user as any)?.experience;
      return data ? (JSON.parse(data) || { company: '', role: '', period: '', desc: '' }) : { company: '', role: '', period: '', desc: '' }; 
    } catch(e) { 
      return { company: '', role: '', period: '', desc: '' }; 
    }
  });
  const [skillsInput, setSkillsInput] = useState((user as any)?.skills?.join(', ') || '');
  const [languages, setLanguages] = useState([]);

  // Load data from Convex
  useEffect(() => {
    if (userFromDB) {
      setPersonalInfo({
        name: userFromDB.name || '',
        email: userFromDB.email || '',
        phone: userFromDB.phone || '',
        location: userFromDB.location || '',
        website: userFromDB.website || '',
      });
      setSummary(userFromDB.summary || '');
      if (userFromDB.education) {
        try { 
          const parsed = JSON.parse(userFromDB.education);
          if (parsed) setEdu(parsed); 
        } catch(e) {}
      }
      if (userFromDB.experience) {
        try { 
          const parsed = JSON.parse(userFromDB.experience);
          if (parsed) setExp(parsed); 
        } catch(e) {}
      }
      if (userFromDB.skills) {
        setSkillsInput(userFromDB.skills.join(', '));
      }
    }
  }, [userFromDB]);

  const skills = skillsInput.split(',').map(s => s.trim()).filter(s => s !== '');

  const handleExport = async () => {
    const html = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
          <h1 style="color: #1A73E8; margin-bottom: 5px;">${personalInfo.name}</h1>
          <p style="color: #666; margin-top: 0;">${personalInfo.location} | ${personalInfo.phone} | ${personalInfo.email}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          
          <h3 style="color: #1A73E8;">RINGKASAN PROFESIONAL</h3>
          <p>${summary}</p>
          
          <h3 style="color: #1A73E8;">PENDIDIKAN</h3>
          <p><strong>${edu.school}</strong><br/>${edu.degree} (${edu.year})</p>
          
          <h3 style="color: #1A73E8;">PENGALAMAN KERJA</h3>
          <p><strong>${exp.company}</strong> - ${exp.role}<br/>${exp.period}<br/>${exp.desc}</p>
          
          <h3 style="color: #1A73E8;">KEAHLIAN</h3>
          <p>${skills.join(', ')}</p>
          
          <h3 style="color: #1A73E8;">BAHASA</h3>
          <p>${languages.join(', ')}</p>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan saat mengekspor PDF.");
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      "Hapus Semua Data",
      "Apakah Anda yakin ingin mengosongkan semua data resume?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Ya, Hapus", 
          style: "destructive",
          onPress: async () => {
            // Local state reset
            setPersonalInfo({ name: '', email: '', phone: '', location: '', website: '' });
            setSummary('');
            setEdu({ school: '', degree: '', year: '' });
            setExp({ company: '', role: '', period: '', desc: '' });
            setSkillsInput('');
            setLanguages([]);

            // Sync with Convex if user exists
            if (user?._id) {
              try {
                await updateProfile({
                  userId: user._id as any,
                  name: user.name || '',
                  phone: '',
                  location: '',
                  website: '',
                  summary: '',
                  education: JSON.stringify({ school: '', degree: '', year: '' }),
                  experience: JSON.stringify({ company: '', role: '', period: '', desc: '' }),
                  skills: [],
                });
                Alert.alert("Sukses", "Data resume telah dihapus dari Cloud.");
              } catch (e) {
                console.error(e);
                Alert.alert("Info", "Data lokal dihapus, namun gagal sinkronisasi ke Cloud.");
              }
            }
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    if (!user?._id) {
      Alert.alert("Error", "Sesi login tidak valid. Silakan masuk kembali.");
      return;
    }

    try {
      const updated = await updateProfile({
        userId: user._id as any,
        name: personalInfo.name,
        phone: personalInfo.phone,
        location: personalInfo.location,
        website: personalInfo.website,
        summary: summary,
        education: JSON.stringify(edu),
        experience: JSON.stringify(exp),
        skills: skills,
      });
      
      if (updated) {
        // Sync local store
        setUser({ ...updated, id: updated._id } as any);
        setIsEditing(false);
        Alert.alert("Sukses", "Profil berhasil disimpan ke Cloud!");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan profil ke server.");
    }
  };

  const handleAIAnalyze = () => {
    router.push({
      pathname: '/ai-chat',
      params: { mode: 'analyze', data: JSON.stringify({ summary, skills, edu, exp }) }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Profil Profesional</Text>
            <Text style={styles.pageSubtitle}>Kelola resume dan profilmu</Text>
          </View>
        </View>

        <View style={styles.resumeCard}>
          {/* Kontak & Dasar */}
          <View style={styles.cardHeader}>
            <Text style={styles.sectionHeading}>Informasi Kontak</Text>
          </View>
          {isEditing ? (
            <View>
              <WorkInput label="Nama Lengkap" value={personalInfo.name} onChangeText={(t) => setPersonalInfo({...personalInfo, name: t})} />
              <WorkInput label="Nomor Telepon" value={personalInfo.phone} onChangeText={(t) => setPersonalInfo({...personalInfo, phone: t})} />
              <WorkInput label="Lokasi" value={personalInfo.location} onChangeText={(t) => setPersonalInfo({...personalInfo, location: t})} />
              <WorkInput label="Website/Portfolio" value={personalInfo.website} onChangeText={(t) => setPersonalInfo({...personalInfo, website: t})} />
            </View>
          ) : (
            <View style={styles.contactView}>
              <Text style={styles.userName}>{personalInfo.name || 'Belum diisi'}</Text>
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={14} color="#5F6368" />
                <Text style={styles.contactText}>{personalInfo.phone || '-'}</Text>
              </View>
              <View style={styles.contactRow}>
                <Ionicons name="location-outline" size={14} color="#5F6368" />
                <Text style={styles.contactText}>{personalInfo.location || '-'}</Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Ringkasan */}
          <View style={styles.cardHeader}>
            <Text style={styles.sectionHeading}>Tentang Saya</Text>
          </View>
          {isEditing ? (
            <TextInput
              style={styles.textArea}
              multiline
              value={summary}
              onChangeText={setSummary}
              placeholder="Ceritakan tentang dirimu..."
            />
          ) : (
            <Text style={styles.summaryText}>{summary || 'Belum ada ringkasan'}</Text>
          )}

          <View style={styles.divider} />

          {/* Pendidikan */}
          <View style={styles.cardHeader}>
            <Text style={styles.sectionHeading}>Pendidikan</Text>
          </View>
          {isEditing ? (
            <View>
              <WorkInput label="Sekolah/Universitas" value={edu.school} onChangeText={(t) => setEdu({...edu, school: t})} />
              <WorkInput label="Bidang Studi" value={edu.degree} onChangeText={(t) => setEdu({...edu, degree: t})} />
              <WorkInput label="Tahun" value={edu.year} onChangeText={(t) => setEdu({...edu, year: t})} />
            </View>
          ) : (
            <View>
              <Text style={styles.subTitle}>{edu.school || 'Belum diisi'}</Text>
              <Text style={styles.userDetail}>{edu.degree || '-'}</Text>
              <Text style={styles.yearText}>{edu.year || '-'}</Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* Pengalaman */}
          <View style={styles.cardHeader}>
            <Text style={styles.sectionHeading}>Pengalaman Kerja</Text>
          </View>
          {isEditing ? (
            <View>
              <WorkInput label="Perusahaan" value={exp.company} onChangeText={(t) => setExp({...exp, company: t})} />
              <WorkInput label="Jabatan" value={exp.role} onChangeText={(t) => setExp({...exp, role: t})} />
              <TextInput
                style={[styles.textArea, { marginTop: 10 }]}
                multiline
                value={exp.desc}
                onChangeText={(t) => setExp({...exp, desc: t})}
                placeholder="Deskripsi pekerjaan..."
              />
            </View>
          ) : (
            <View>
              <Text style={styles.subTitle}>{exp.company || 'Belum diisi'}</Text>
              <Text style={styles.userDetail}>{exp.role || '-'}</Text>
              <Text style={styles.yearText}>{exp.period || '-'}</Text>
            </View>
          )}

          <View style={styles.divider} />

          {/* Keahlian */}
          <View style={styles.cardHeader}>
            <Text style={styles.sectionHeading}>Keahlian</Text>
          </View>
          {isEditing ? (
            <WorkInput 
              label="Keahlian (pisahkan dengan koma)" 
              value={skillsInput} 
              onChangeText={setSkillsInput} 
              placeholder="e.g. React, Java, Design"
            />
          ) : (
            <View style={styles.tagGroup}>
              {skills.length > 0 ? skills.map(tag => (
                <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
              )) : <Text style={styles.contactText}>Belum ada keahlian</Text>}
            </View>
          )}
        </View>

        {/* Action Buttons at the Bottom */}
        <View style={styles.bottomActions}>
          <View style={styles.editRow}>
            <TouchableOpacity 
              style={[styles.actionBtn, isEditing ? styles.saveBtn : styles.editBtn]} 
              onPress={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              <Ionicons name={isEditing ? "checkmark" : "create-outline"} size={18} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>{isEditing ? "Simpan Profil" : "Edit Profil"}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionBtn, styles.clearBtn]} 
              onPress={handleClearAll}
            >
              <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>Hapus Data</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.pdfBtn} 
            onPress={handleExport}
          >
            <Ionicons name="document-text-outline" size={18} color="#1A73E8" />
            <Text style={styles.pdfBtnText}>Ekspor PDF ke Handphone</Text>
          </TouchableOpacity>
        </View>

        {/* AI Analysis at the very bottom */}
        <TouchableOpacity activeOpacity={0.9} onPress={handleAIAnalyze} style={styles.aiBottomCard}>
          <LinearGradient
            colors={['#1A73E8', '#673AB7']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.aiGradient}
          >
            <View style={styles.aiContent}>
              <Ionicons name="sparkles" size={18} color="#FFFFFF" />
              <Text style={styles.aiBtnText}>Analisis Profil dengan AI Advisor</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  header: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#202124',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#5F6368',
    marginTop: 2,
    fontWeight: '500',
  },
  resumeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F3F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 24,
  },
  cardHeader: {
    marginBottom: 12,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1A73E8',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#202124',
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 13,
    color: '#5F6368',
    fontWeight: '600',
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#3C4043',
    fontWeight: '500',
  },
  textArea: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#202124',
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F3F4',
    marginVertical: 20,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#202124',
    marginBottom: 2,
  },
  userDetail: {
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: '700',
  },
  yearText: {
    fontSize: 12,
    color: '#9AA0A6',
    fontWeight: '600',
    marginTop: 2,
  },
  tagGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#F1F3F4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 12,
    color: '#202124',
    fontWeight: '700',
  },
  bottomActions: {
    marginBottom: 24,
  },
  editRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editBtn: {
    backgroundColor: '#1A73E8',
  },
  saveBtn: {
    backgroundColor: '#00C896',
  },
  clearBtn: {
    backgroundColor: '#FF5252',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  pdfBtn: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1A73E8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  pdfBtnText: {
    color: '#1A73E8',
    fontWeight: '800',
    fontSize: 14,
  },
  aiBottomCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  aiGradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  aiContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  aiBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  }
});



