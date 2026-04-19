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
  FlatList,
  Platform,
  TextInput
} from 'react-native';
import { ALL_JOBS, CATEGORIES } from '../../constants/jobs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const router = useRouter();
  
  // Get top 3 jobs for recommendation
  const recommendedJobs = ALL_JOBS.slice(0, 3);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Selamat Pagi, Bryan 👋</Text>
            <Text style={styles.subtitle}>Ayo temukan masa depanmu!</Text>
          </View>
          <View style={styles.profileContainer}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/100' }} 
              style={styles.profileImg} 
            />
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar} 
          activeOpacity={0.9}
          onPress={() => router.push('/recommendation')}
        >
          <Ionicons name="search-outline" size={20} color="#9AA0A6" />
          <Text style={styles.searchPlaceholder}>Cari pekerjaan di Manado...</Text>
          <View style={styles.filterIcon}>
            <Ionicons name="options-outline" size={20} color="#1A73E8" />
          </View>
        </TouchableOpacity>

        {/* AI Card */}
        <TouchableOpacity activeOpacity={0.95}>
          <LinearGradient
            colors={['#1A73E8', '#00C896']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.aiCard}
          >
            <View style={styles.aiCardContent}>
              <View style={styles.aiIconBox}>
                <Ionicons name="sparkles" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.aiTextBox}>
                <Text style={styles.aiCardTitle}>Target AI Hari Ini</Text>
                <Text style={styles.aiCardDesc}>Berdasarkan profilmu, kami menemukan 12 pekerjaan baru hari ini.</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Recommended Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Direkomendasikan Untukmu</Text>
          <TouchableOpacity onPress={() => router.push('/recommendation')}><Text style={styles.seeAll}>Lihat Semua</Text></TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {recommendedJobs.map(job => (
            <TouchableOpacity 
              key={job.id} 
              style={styles.jobCard} 
              activeOpacity={0.8}
              onPress={() => router.push({
                pathname: '/job-detail',
                params: { 
                  id: job.id,
                  title: job.title, 
                  company: job.company, 
                  location: job.location, 
                  salary: job.salary 
                }
              })}
            >
              <View style={styles.jobCardHeader}>
                <View style={styles.companyLogo}>
                  <Ionicons name={job.logo as any} size={28} color="#1A73E8" />
                </View>
                <View style={styles.fullTimeBadge}>
                  <Text style={styles.fullTimeText}>{job.type}</Text>
                </View>
              </View>
              <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
              <Text style={styles.companyName}>{job.company}</Text>
              <View style={styles.jobFooter}>
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={14} color="#9AA0A6" />
                  <Text style={styles.locationText}>{job.location}</Text>
                </View>
                <Text style={styles.salaryText}>{job.salary}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Kategori Populer</Text>
        </View>
        
        <View style={styles.categoryGrid}>
          {CATEGORIES.map(category => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryItem} 
              activeOpacity={0.7}
              onPress={() => router.push({
                pathname: '/category-jobs',
                params: { title: category.name }
              })}
            >
              <View style={[styles.categoryIconBox, { backgroundColor: category.color + '15' }]}>
                <Ionicons name={category.icon as any} size={24} color={category.color} />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 12,
    color: '#9AA0A6',
    fontSize: 15,
  },
  filterIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#E8F1FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#202124',
  },
  subtitle: {
    fontSize: 14,
    color: '#5F6368',
    marginTop: 4,
    fontWeight: '500',
  },
  profileContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F1F3F4',
    padding: 2,
  },
  profileImg: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  aiCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 6,
  },
  aiCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconBox: {
    width: 52,
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiTextBox: {
    flex: 1,
    marginLeft: 16,
  },
  aiCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  aiCardDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#202124',
  },
  seeAll: {
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: '700',
  },
  horizontalList: {
    paddingLeft: 24,
    paddingRight: 8,
    paddingBottom: 20,
  },
  jobCard: {
    width: width * 0.7,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#F1F3F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  companyLogo: {
    width: 48,
    height: 48,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullTimeBadge: {
    backgroundColor: '#E8F1FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  fullTimeText: {
    fontSize: 11,
    color: '#1A73E8',
    fontWeight: '700',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#202124',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#5F6368',
    fontWeight: '500',
    marginBottom: 16,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#9AA0A6',
    marginLeft: 4,
  },
  salaryText: {
    fontSize: 14,
    color: '#00C896',
    fontWeight: '800',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  categoryItem: {
    width: (width - 32) / 3,
    alignItems: 'center',
    marginBottom: 24,
  },
  categoryIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#202124',
  }
});
