import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import WorkButton from '../../components/WorkButton';
import { useSavedJobsStore } from '../../hooks/useSavedJobsStore';
import { useUserStore } from '../../hooks/useUserStore';


export default function ProfileScreen() {
  const router = useRouter();
  const { savedJobIds } = useSavedJobsStore();
  const { logout } = useUserStore();


  const SKILLS = ['React Native', 'JavaScript', 'UI Design', 'Manajemen Project', 'Data Analytics'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header / Cover */}
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80' }} 
            style={styles.coverImg} 
          />
          <View style={styles.profileInfoContainer}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?u=bryan' }} 
              style={styles.avatar} 
            />
            <Text style={styles.userName}>Bryan Manueke</Text>
            <Text style={styles.userTitle}>Fullstack Developer & UI Designer</Text>
            <Text style={styles.userLocation}>Manado, Sulawesi Utara</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>Dilamar</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>5</Text>
            <Text style={styles.statLabel}>Interview</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity 
            style={styles.statItem}
            onPress={() => router.push('/(tabs)/saved')}
          >
            <Text style={styles.statNum}>{savedJobIds.length}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </TouchableOpacity>
        </View>


        {/* Sections */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Keahlian Utama</Text>
          <View style={styles.skillGrid}>
            {SKILLS.map(skill => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addSkillBtn}>
              <Ionicons name="add" size={18} color="#1A73E8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Pengaturan Akun</Text>
          <View style={styles.menuBox}>
            <MenuLink icon="person-outline" title="Edit Profil" onPress={() => {}} />
            <MenuLink icon="bookmark-outline" title="Pekerjaan Tersimpan" onPress={() => router.push('/(tabs)/saved')} />
            <MenuLink icon="document-text-outline" title="Resume Saya" onPress={() => router.push('/(tabs)/resume')} />
            <MenuLink icon="notifications-outline" title="Pemberitahuan" onPress={() => {}} />
            <MenuLink icon="shield-checkmark-outline" title="Keamanan" onPress={() => {}} />
          </View>


          <WorkButton 
            title="Keluar Akun" 
            variant="link" 
            onPress={() => {
              logout();
              router.replace('/login');
            }}
            style={styles.logoutBtn}
          />
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuLink({ icon, title, onPress }: { icon: any, title: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIconBox}>
          <Ionicons name={icon} size={20} color="#5F6368" />
        </View>
        <Text style={styles.menuTitle}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9AA0A6" />
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 320,
    position: 'relative',
  },
  coverImg: {
    width: '100%',
    height: 180,
  },
  profileInfoContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: -50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: '#F1F3F4',
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#202124',
    marginTop: 12,
  },
  userTitle: {
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: '700',
    marginTop: 4,
  },
  userLocation: {
    fontSize: 13,
    color: '#9AA0A6',
    marginTop: 4,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    marginHorizontal: 24,
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#202124',
  },
  statLabel: {
    fontSize: 12,
    color: '#5F6368',
    marginTop: 2,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#DADCE0',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#202124',
    marginBottom: 16,
  },
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  skillChip: {
    backgroundColor: '#E8F1FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 13,
    color: '#1A73E8',
    fontWeight: '700',
  },
  addSkillBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1A73E8',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBox: {
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#202124',
  },
  logoutBtn: {
    color: '#EA4335',
  }
});
