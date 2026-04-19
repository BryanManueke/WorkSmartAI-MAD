import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import WorkButton from '../components/WorkButton';

const { width } = Dimensions.get('window');

export default function JobDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Banner Section */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' }} 
            style={styles.bannerImg} 
          />
          <View style={styles.bannerOverlay} />
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Floating Logo */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoBox}>
            <Ionicons name="logo-google" size={40} color="#5F6368" />
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.jobTitle}>{params.title || 'Senior UI/UX Designer'}</Text>
          <Text style={styles.companyName}>{params.company || 'Google Indonesia'}</Text>
          
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color="#5F6368" />
              <Text style={styles.metaText}>{params.location || 'Jakarta'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="cash-outline" size={16} color="#5F6368" />
              <Text style={styles.metaText}>{params.salary || 'Rp 15-25 Jt'}</Text>
            </View>
          </View>

          <View style={styles.chipRow}>
            <View style={styles.chip}><Text style={styles.chipText}>Remote</Text></View>
            <View style={styles.chip}><Text style={styles.chipText}>Full-time</Text></View>
            <View style={styles.chip}><Text style={styles.chipText}>Mid-Level</Text></View>
          </View>

          {/* AI Match Card */}
          <View style={styles.aiCard}>
            <View style={styles.aiHeader}>
              <View style={styles.aiIconBox}>
                <Ionicons name="sparkles" size={20} color="#00C896" />
              </View>
              <Text style={styles.aiMatchText}>Pekerjaan ini cocok <Text style={{ color: '#00C896' }}>92%</Text> dengan profilmu</Text>
            </View>
            <View style={styles.breakdownBar}>
              <View style={[styles.breakdownFill, { width: '92%', backgroundColor: '#00C896' }]} />
            </View>
            <Text style={styles.aiHint}>AI mereview skill Desain UI dan pengalaman Figma Anda.</Text>
          </View>

          {/* Details */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Tentang Pekerjaan</Text>
            <Text style={styles.sectionDesc}>
              {params.description || "Kami mencari desainer yang berbakat untuk membantu kami membangun masa depan internet yang lebih inklusif dan mudah diakses bagi semua orang di Indonesia."}
            </Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Persyaratan</Text>
            <Text style={styles.sectionDesc}>
              • Minimal 3 tahun pengalaman di bidang desain UI/UX.{"\n"}
              • Menguasai Figma, Adobe XD, dan prototyping tools.{"\n"}
              • Pernah mengerjakan proyek aplikasi mobile berskala besar.
            </Text>
          </View>

        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn}>
          <Ionicons name="bookmark-outline" size={24} color="#1A73E8" />
        </TouchableOpacity>
        <WorkButton 
          title="Lamar Sekarang" 
          onPress={() => {}} 
          style={{ flex: 1 }} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  bannerContainer: {
    height: 240,
    width: '100%',
    position: 'relative',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 20,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: -40,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  jobTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#202124',
    textAlign: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A73E8',
    textAlign: 'center',
    marginBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  metaText: {
    fontSize: 14,
    color: '#5F6368',
    marginLeft: 6,
    fontWeight: '500',
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  chip: {
    backgroundColor: '#F1F3F4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  chipText: {
    fontSize: 12,
    color: '#5F6368',
    fontWeight: '700',
  },
  aiCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E8F1FF',
    marginBottom: 40,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiIconBox: {
    width: 36,
    height: 36,
    backgroundColor: '#E6FFF5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiMatchText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#202124',
    flex: 1,
  },
  breakdownBar: {
    height: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 4,
  },
  aiHint: {
    fontSize: 12,
    color: '#9AA0A6',
    fontStyle: 'italic',
  },
  detailSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#202124',
    marginBottom: 12,
  },
  sectionDesc: {
    fontSize: 15,
    color: '#5F6368',
    lineHeight: 24,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 35 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  saveBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: '#1A73E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  }
});
