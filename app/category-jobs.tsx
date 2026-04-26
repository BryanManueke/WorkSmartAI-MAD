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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function CategoryJobsScreen() {
  const router = useRouter();
  const { title } = useLocalSearchParams();
  
  // Ambil data pekerjaan berdasarkan kategori dari Convex
  const jobs = useQuery(api.jobs.getByCategory, { category: title as string }) || [];

  const renderJobItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.jobCard} 
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: '/job-detail',
        params: { 
          id: item._id,
          title: item.title, 
          company: item.company, 
          location: item.location, 
          salary: item.salary 
        }
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#202124" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 44 }} />
      </View>

      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listPadding}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="search-outline" size={60} color="#F1F3F4" />
            <Text style={styles.emptyText}>Belum ada lowongan di kategori ini</Text>
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
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#202124',
  },
  listPadding: {
    padding: 24,
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
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    color: '#9AA0A6',
    fontWeight: '500',
  }
});
