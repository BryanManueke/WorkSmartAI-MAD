import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUserStore } from '@/stores';

export default function SavedJobsScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  
  // Ambil data pekerjaan yang disimpan dari Convex
  const savedJobs = useQuery(api.bookmarks.getSavedJobs, { 
    userId: user?._id as any 
  }) || [];

  const renderJobItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.jobCard} 
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: '/job-detail',
        params: { id: item._id }
      })}
    >
      <View style={styles.cardRow}>
        <View style={styles.logoBox}>
          <Ionicons name={item.logo} size={24} color="#1A73E8" />
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.companyName}>{item.company}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>{item.location}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.salaryText}>{item.salary}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9AA0A6" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pekerjaan Tersimpan</Text>
      </View>

      <FlatList
        data={savedJobs}
        renderItem={renderJobItem}
        keyExtractor={item => (item as any)._id}
        contentContainerStyle={styles.listPadding}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <View style={styles.emptyIconBox}>
                <Ionicons name="bookmark-outline" size={60} color="#E8F1FF" />
            </View>
            <Text style={styles.emptyTitle}>Belum ada simpanan</Text>
            <Text style={styles.emptyDesc}>Pekerjaan yang kamu simpan akan muncul di sini untuk dilihat nanti.</Text>
            <TouchableOpacity 
                style={styles.exploreBtn}
                onPress={() => router.push('/(tabs)/recommendation')}
            >
                <Text style={styles.exploreBtnText}>Cari Pekerjaan</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
    paddingTop: Platform.OS === 'android' ? 50 : 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#202124',
  },
  listPadding: {
    padding: 24,
    paddingBottom: 100,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F3F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBox: {
    width: 48,
    height: 48,
    backgroundColor: '#E8F1FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoBox: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#5F6368',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#9AA0A6',
  },
  metaDot: {
    marginHorizontal: 6,
    color: '#9AA0A6',
  },
  salaryText: {
    fontSize: 12,
    color: '#00C896',
    fontWeight: '700',
  },
  emptyBox: {
    marginTop: 80,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconBox: {
    width: 120,
    height: 120,
    backgroundColor: '#F8F9FA',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#5F6368',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  exploreBtn: {
    backgroundColor: '#1A73E8',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  }
});
