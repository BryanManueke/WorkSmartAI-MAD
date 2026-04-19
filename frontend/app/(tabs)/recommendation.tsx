import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  FlatList, 
  TextInput, 
  TouchableOpacity,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FILTERS = ['Semua', 'Remote', 'Full-time', 'Part-time', 'Magang'];

const RECOMMENDATIONS = [
  { id: '1', title: 'Senior Product UI/UX Designer', company: 'Google Indonesia', match: '98%', salary: 'Rp 25-35 Jt', location: 'Jakarta (Hybrid)', logo: 'logo-google' },
  { id: '2', title: 'Lead Frontend Engineer', company: 'Tokopedia', match: '95%', salary: 'Rp 20-30 Jt', location: 'Remote', logo: 'logo-android' },
  { id: '3', title: 'Creative Art Director', company: 'Shopee', match: '92%', salary: 'Rp 18-28 Jt', location: 'Singapore', logo: 'logo-apple' },
  { id: '4', title: 'Mobile Developer (React)', company: 'Gojek', match: '90%', salary: 'Rp 15-25 Jt', location: 'Jakarta', logo: 'bicycle' },
  { id: '5', title: 'Data Scientist Junior', company: 'Traveloka', match: '88%', salary: 'Rp 12-20 Jt', location: 'Bangkok', logo: 'airplane' },
];

export default function Recommendation() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('Semua');

  const renderJobItem = ({ item }: { item: typeof RECOMMENDATIONS[0] }) => (
    <TouchableOpacity 
      style={styles.jobItem} 
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: '/job-detail',
        params: { 
          title: item.title, 
          company: item.company, 
          location: item.location, 
          salary: item.salary 
        }
      })}
    >
      <View style={styles.jobItemHeader}>
        <View style={styles.logoBox}>
          <Ionicons name={item.logo as any} size={28} color="#5F6368" />
        </View>
        <TouchableOpacity><Ionicons name="bookmark-outline" size={24} color="#9AA0A6" /></TouchableOpacity>
      </View>
      
      <View style={styles.jobMainInfo}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.companyName}>{item.company}</Text>
      </View>

      <View style={styles.jobMeta}>
        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <Ionicons name="location-outline" size={14} color="#5F6368" />
            <Text style={styles.badgeText}>{item.location}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="cash-outline" size={14} color="#5F6368" />
            <Text style={styles.badgeText}>{item.salary}</Text>
          </View>
        </View>
        <View style={styles.matchBadge}>
          <View style={styles.aiSpark}>
            <Ionicons name="sparkles" size={10} color="#00C896" />
          </View>
          <Text style={styles.matchPercent}>{item.match} Cocok</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        {/* Search Bar */}
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#9AA0A6" style={styles.searchIcon} />
            <TextInput 
              placeholder="Cari kerja impianmu..." 
              style={styles.searchInput}
              placeholderTextColor="#9AA0A6"
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
            {FILTERS.map(filter => (
              <TouchableOpacity 
                key={filter} 
                onPress={() => setActiveFilter(filter)}
                style={[styles.chip, activeFilter === filter && styles.chipActive]}
              >
                <Text style={[styles.chipText, activeFilter === filter && styles.chipTextActive]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Main List */}
      <FlatList 
        data={RECOMMENDATIONS}
        renderItem={renderJobItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fabWrapper} activeOpacity={0.9}>
        <LinearGradient
          colors={['#1A73E8', '#00C896']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fab}
        >
          <Ionicons name="sparkles" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.fabText}>Biarkan AI Menyempurnakan Pencarianku</Text>
        </LinearGradient>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topContainer: {
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#202124',
  },
  filterBtn: {
    width: 52,
    height: 52,
    backgroundColor: '#1A73E8',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterSection: {
    paddingBottom: 16,
  },
  filterList: {
    paddingHorizontal: 20,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F1F3F4',
    marginHorizontal: 4,
  },
  chipActive: {
    backgroundColor: '#1A73E8',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5F6368',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  listPadding: {
    padding: 24,
    paddingBottom: 120,
  },
  jobItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F3F4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  jobItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoBox: {
    width: 52,
    height: 52,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobMainInfo: {
    marginBottom: 20,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#202124',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 15,
    color: '#5F6368',
    fontWeight: '500',
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5F6368',
    marginLeft: 4,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00C89630',
  },
  aiSpark: {
    marginRight: 4,
  },
  matchPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: '#00C896',
  },
  fabWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  fab: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  }
});
