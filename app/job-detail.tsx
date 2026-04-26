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
  Alert,
  Platform,
  Linking
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSavedJobsStore, useUserStore } from '../stores';
import { JOB_ASSETS } from '../data/jobs';

// Standard Components
import { ContactModal } from '../components/ui/ContactModal';

const { width } = Dimensions.get('window');

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useUserStore();
  const [showContactModal, setShowContactModal] = useState(false);
  
  // Bookmark logic via Convex
  const isSaved = useQuery(api.bookmarks.checkIsSaved, { 
    userId: user?._id as any, 
    jobId: id as any 
  });
  const toggleBookmark = useMutation(api.bookmarks.toggle);

  // Ambil data pekerjaan spesifik dari Convex
  // Pastikan ID valid (bukan ID dummy "t1", "t2", dsb) sebelum query
  const isValidId = typeof id === 'string' && id.length > 5; // Convex IDs are long
  const job = useQuery(api.jobs.getById, isValidId ? { jobId: id as any } : "skip" as any);
  
  if (!isValidId || !job) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#5F6368', fontWeight: 'bold' }}>Memuat Detail...</Text>
      </View>
    );
  }

  const saved = !!isSaved;

  const handleWhatsApp = () => {
    if (!job) return;
    const name = user?.name || 'Kandidat';
    const message = `Halo Tim Rekrutmen ${job.company}, saya ${name}. Saya melihat lowongan ${job.title} melalui WorkSmartAI. Berdasarkan Analisis AI, saya memiliki skor kecocokan sebesar 92%. Saya tertarik untuk mendiskusikan kualifikasi saya lebih lanjut.`;
    const url = `whatsapp://send?phone=6281234567890&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Error", "Aplikasi WhatsApp tidak terinstall.");
      }
    });
    setShowContactModal(false);
  };

  const handleEmail = () => {
    const subject = `Lamaran Pekerjaan: ${job.title} - ${user?.name || 'Kandidat'}`;
    const body = `Halo Tim Rekrutmen ${job.company},\n\nPerkenalkan saya ${user?.name || 'Kandidat'}. Melalui aplikasi WorkSmartAI, profil saya terdeteksi memiliki kecocokan tinggi (92%) untuk posisi ${job.title}.\n\nBerikut ringkasan profil saya...\n\nTerima kasih.`;
    const url = `mailto:recruitment@company.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(url);
    setShowContactModal(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner with Back Button */}
        <View style={styles.bannerContainer}>
          <Image source={JOB_ASSETS[job.banner as keyof typeof JOB_ASSETS]} style={styles.banner} />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent']}
            style={styles.headerOverlay}
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.contentCard}>
          <View style={styles.headerInfo}>
            <View style={styles.logoBox}>
              <Ionicons name={job.logo as any} size={32} color="#1A73E8" />
            </View>
            <View style={styles.titleBox}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.companyName}>{job.company}</Text>
            </View>
          </View>

          {/* AI Score Insight */}
          <LinearGradient
            colors={['#E8F1FF', '#F1F3F4']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.aiInsightBox}
          >
            <View style={styles.aiHeader}>
              <Ionicons name="sparkles" size={20} color="#1A73E8" />
              <Text style={styles.aiTitle}>Analisis AI WorkSmart</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreValue}>92%</Text>
              <Text style={styles.scoreLabel}>Kecocokan Profil</Text>
            </View>
            <Text style={styles.aiReason}>
              "Berdasarkan analisis skill dan preferensi, profil Anda sangat direkomendasikan untuk posisi ini."
            </Text>
          </LinearGradient>

          <View style={styles.tagsContainer}>
            <View style={styles.tag}><Text style={styles.tagText}>{job.type}</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>{job.location}</Text></View>
            <View style={[styles.tag, { backgroundColor: '#E6FFF5' }]}><Text style={[styles.tagText, { color: '#00C896' }]}>{job.salary}</Text></View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tentang Pekerjaan</Text>
            <Text style={styles.description}>{job.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Persyaratan</Text>
            {job.requirements?.map((req, i) => (
              <View key={i} style={styles.listItem}>
                <Ionicons name="checkmark-circle" size={18} color="#00C896" />
                <Text style={styles.listText}>{req}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tanggung Jawab</Text>
            {job.responsibilities?.map((res, i) => (
              <View key={i} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>{res}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Floating Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.saveBtn, saved && styles.savedBtn]} 
          onPress={async () => {
            if (!user?._id) {
              Alert.alert("Login Diperlukan", "Silakan login untuk menyimpan pekerjaan.");
              return;
            }
            try {
              await toggleBookmark({ userId: user._id as any, jobId: (job as any)._id });
              Alert.alert(saved ? "Dihapus" : "Disimpan", saved ? "Lowongan dihapus dari daftar simpan." : "Lowongan berhasil disimpan!");
            } catch (e) {
              Alert.alert("Error", "Gagal menyimpan pekerjaan.");
            }
          }}
        >
          <Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={24} color={saved ? "#1A73E8" : "#5F6368"} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.applyBtn} onPress={() => setShowContactModal(true)}>
          <LinearGradient
            colors={['#1A73E8', '#007BFF']}
            style={styles.applyGradient}
          >
            <Text style={styles.applyText}>Hubungi Perusahaan</Text>
            <Ionicons name="chatbubbles-outline" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ContactModal 
        visible={showContactModal}
        companyName={job.company}
        onClose={() => setShowContactModal(false)}
        onWhatsApp={handleWhatsApp}
        onEmail={handleEmail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  bannerContainer: { width: '100%', height: 240, position: 'relative' },
  banner: { width: '100%', height: '100%' },
  headerOverlay: { ...StyleSheet.absoluteFillObject },
  backBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 24, width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  contentCard: { flex: 1, marginTop: -30, backgroundColor: '#FFFFFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24 },
  headerInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  logoBox: { width: 64, height: 64, backgroundColor: '#F8F9FA', borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F1F3F4' },
  titleBox: { marginLeft: 16, flex: 1 },
  jobTitle: { fontSize: 22, fontWeight: '900', color: '#202124' },
  companyName: { fontSize: 16, color: '#1A73E8', fontWeight: '700', marginTop: 2 },
  aiInsightBox: { padding: 20, borderRadius: 20, marginBottom: 24 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  aiTitle: { fontSize: 14, fontWeight: '800', color: '#1A73E8', marginLeft: 8, textTransform: 'uppercase' },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  scoreValue: { fontSize: 32, fontWeight: '900', color: '#1A73E8' },
  scoreLabel: { fontSize: 13, color: '#5F6368', marginLeft: 8, fontWeight: '600' },
  aiReason: { fontSize: 13, color: '#5F6368', lineHeight: 20, fontStyle: 'italic' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  tag: { backgroundColor: '#F1F3F4', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginRight: 8, marginBottom: 8 },
  tagText: { fontSize: 13, color: '#5F6368', fontWeight: '700' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#202124', marginBottom: 16 },
  description: { fontSize: 15, color: '#5F6368', lineHeight: 24, fontWeight: '500' },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  listText: { fontSize: 15, color: '#5F6368', marginLeft: 12, flex: 1, fontWeight: '500' },
  bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1A73E8', marginTop: 8 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 24, borderTopWidth: 1, borderTopColor: '#F1F3F4', flexDirection: 'row', alignItems: 'center' },
  saveBtn: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  savedBtn: { backgroundColor: '#E8F1FF' },
  applyBtn: { flex: 1, height: 56 },
  applyGradient: { flex: 1, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#1A73E8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  applyText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
});
