import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Platform,
  Dimensions
} from 'react-native';
import { useQuery, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/stores';
import { useEffect } from 'react';

const FILTERS = ['Semua', 'Terbaru', 'Gaji Tinggi', 'Full-time', 'Magang'];

export default function Recommendation() {
  const router = useRouter();
  const { user } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showFilters, setShowFilters] = useState(false);
  const [rankedJobs, setRankedJobs] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Ambil semua pekerjaan dari Convex
  const allConvexJobs = useQuery(api.jobs.listAll) || [];
  const userProfile = useQuery(api.users.getProfile, user?._id ? { userId: user._id as any } : "skip" as any);
  const rankJobsAction = useAction(api.ai.rankJobs);

  const handleAIAnalysis = async () => {
    if (!user?._id) return;
    setIsAnalyzing(true);
    try {
      const results = await rankJobsAction({
        userProfile: userProfile,
        jobs: allConvexJobs
      });
      setRankedJobs(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const displayJobs = useMemo(() => {
    let results = rankedJobs.length > 0 ? [...rankedJobs] : [...allConvexJobs];
    
    if (searchQuery) {
      results = results.filter((job: any) => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply Filter logic
    if (activeFilter === 'Gaji Tinggi') {
      results = results.filter((j: any) => {
        const salaryNum = parseInt(j.salary.replace(/[^0-9]/g, ''));
        return salaryNum >= 6;
      });
    } else if (activeFilter === 'Full-time' || activeFilter === 'Magang') {
      results = results.filter((j: any) => j.type === activeFilter);
    } else if (activeFilter === 'Terbaru') {
      results = results.slice().reverse(); 
    }

    return results;
  }, [allConvexJobs, rankedJobs, searchQuery, activeFilter]);

  const renderJobItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.jobItem} 
      activeOpacity={0.8}
      onPress={() => router.push({
        pathname: '/job-detail',
        params: { id: item._id }
      })}
    >
      <View style={styles.jobItemHeader}>
        <View style={styles.logoBox}>
          <Ionicons name={item.logo as any} size={28} color="#1A73E8" />
        </View>
        {item.matchScore > 0 && (
          <View style={[styles.matchBadge, { backgroundColor: item.matchScore > 80 ? '#00C896' : '#FBBC05' }]}>
            <Text style={styles.matchText}>{item.matchScore}% Match</Text>
          </View>
        )}
      </View>
      
      <View style={styles.jobMainInfo}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.companyName}>{item.company}</Text>
        {item.matchReason && (
          <Text style={styles.matchReason} numberOfLines={2}>AI: {item.matchReason}</Text>
        )}
      </View>

      <View style={styles.jobMeta}>
        <View style={styles.metaRow}>
          <View style={styles.badge}>
            <Ionicons name="location-outline" size={12} color="#5F6368" />
            <Text style={styles.badgeText}>{item.location}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="briefcase-outline" size={12} color="#5F6368" />
            <Text style={styles.badgeText}>{item.type}</Text>
          </View>
        </View>
        <Text style={styles.salaryText}>{item.salary}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        {/* Search Bar Row */}
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#9AA0A6" style={styles.searchIcon} />
            <TextInput 
              placeholder="Posisi atau perusahaan..." 
              style={styles.searchInput}
              placeholderTextColor="#9AA0A6"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            style={[styles.filterBtn, showFilters && styles.filterBtnActive]} 
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="options-outline" size={22} color={showFilters ? "#FFFFFF" : "#1A73E8"} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.aiButton, isAnalyzing && { opacity: 0.7 }]} 
          onPress={handleAIAnalysis}
          disabled={isAnalyzing}
        >
          <Ionicons name="sparkles" size={18} color="#FFFFFF" />
          <Text style={styles.aiButtonText}>
            {isAnalyzing ? 'Menganalisis...' : 'Dapatkan Rekomendasi AI Personal'}
          </Text>
        </TouchableOpacity>

        {/* Toggleable Filter Chips */}
        {showFilters && (
          <View style={styles.filterSection}>
            <View style={styles.filterChipContainer}>
              {FILTERS.map(filter => (
                <TouchableOpacity 
                  key={filter} 
                  onPress={() => setActiveFilter(filter)}
                  style={[styles.chip, activeFilter === filter && styles.chipActive]}
                >
                  <Text style={[styles.chipText, activeFilter === filter && styles.chipTextActive]}>{filter}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <FlatList 
        data={displayJobs}
        renderItem={renderJobItem}
        keyExtractor={item => (item as any)._id}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.resultsCount}>
            {rankedJobs.length > 0 ? 'Urutan berdasarkan kecocokan profil Anda' : `Menampilkan ${displayJobs.length} lowongan di Manado`}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={80} color="#F1F3F4" />
            <Text style={styles.emptyTitle}>Tidak ditemukan</Text>
            <Text style={styles.emptySubtitle}>Pencarian "{searchQuery}" tidak ada.</Text>
            <TouchableOpacity style={styles.resetBtn} onPress={() => { setSearchQuery(''); setActiveFilter('Semua'); setShowFilters(false); setRankedJobs([]); }}>
              <Text style={styles.resetBtnText}>Reset Pencarian</Text>
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
    backgroundColor: '#E8F1FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  filterBtnActive: {
    backgroundColor: '#1A73E8',
  },
  filterSection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 4,
  },
  filterChipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F3F4',
    marginRight: 8,
    marginBottom: 8,
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
    paddingBottom: 100,
  },
  resultsCount: {
    fontSize: 14,
    color: '#9AA0A6',
    fontWeight: '600',
    marginBottom: 20,
  },
  jobItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
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
    backgroundColor: '#E8F1FF',
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
  salaryText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#00C896',
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#202124',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#5F6368',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  resetBtn: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#1A73E8',
    borderRadius: 12,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A73E8',
    marginHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  aiButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    marginLeft: 8,
  },
  matchBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  matchText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  matchReason: {
    fontSize: 12,
    color: '#1A73E8',
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 16,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  }
});
