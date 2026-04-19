import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import WorkButton from '../../components/WorkButton';

export default function Resume() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Resume Saya</Text>
          <TouchableOpacity style={styles.downloadIcon}>
            <Ionicons name="download-outline" size={24} color="#1A73E8" />
          </TouchableOpacity>
        </View>

        {/* AI Generator Card */}
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient
            colors={['#1A73E8', '#00C896']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.aiResumeCard}
          >
            <View style={styles.aiInfo}>
              <View style={styles.sparkIconBox}>
                <Ionicons name="sparkles" size={24} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.aiTitle}>Optimasi dengan AI</Text>
                <Text style={styles.aiDesc}>Buat ringkasan profesional yang disesuaikan dengan jenis pekerjaan targetmu.</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.aiBtn}>
              <Text style={styles.aiBtnText}>Buat Ringkasan AI</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>

        {/* Resume Preview Card */}
        <View style={styles.resumeCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionHeading}>Kontak & Info Utama</Text>
            <TouchableOpacity><Ionicons name="create-outline" size={20} color="#1A73E8" /></TouchableOpacity>
          </View>
          <Text style={styles.userName}>Bryan xm</Text>
          <Text style={styles.userDetail}>Jakarta, Indonesia | 0812-3456-7890</Text>
          <Text style={[styles.userDetail, { color: '#1A73E8', marginTop: 4 }]}>bryan.xm@email.com</Text>

          <View style={styles.divider} />

          <View style={styles.cardHeader}>
            <Text style={styles.sectionHeading}>Pendidikan</Text>
            <TouchableOpacity><Ionicons name="create-outline" size={20} color="#1A73E8" /></TouchableOpacity>
          </View>
          <Text style={styles.subTitle}>Universitas Indonesia</Text>
          <Text style={styles.userDetail}>S1 Teknik Informatika | 2020 - 2024</Text>
          <Text style={styles.ipkText}>IPK: 3.85 / 4.00</Text>

          <View style={styles.divider} />

          <View style={styles.cardHeader}>
            <Text style={styles.sectionHeading}>Keahlian</Text>
            <TouchableOpacity><Ionicons name="create-outline" size={20} color="#1A73E8" /></TouchableOpacity>
          </View>
          <View style={styles.tagGroup}>
            {['React Native', 'TypeScript', 'UI Design', 'Figma', 'Analytical'].map(tag => (
              <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
        <WorkButton 
          title="Ekspor sebagai PDF" 
          variant="social" 
          onPress={() => {}} 
          style={styles.exportBtn}
        />

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#202124',
  },
  downloadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F1FF',
  },
  aiResumeCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  aiInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sparkIconBox: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  aiDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  aiBtn: {
    backgroundColor: '#FFFFFF',
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBtnText: {
    color: '#1A73E8',
    fontWeight: '800',
    fontSize: 14,
  },
  resumeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F1F3F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#202124',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#202124',
    marginBottom: 4,
  },
  userDetail: {
    fontSize: 14,
    color: '#5F6368',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F3F4',
    marginVertical: 24,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4,
  },
  ipkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00C896',
    marginTop: 8,
  },
  tagGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  tagText: {
    fontSize: 13,
    color: '#5F6368',
    fontWeight: '600',
  },
  exportBtn: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#E8EAED',
    backgroundColor: '#FFFFFF',
  }
});
