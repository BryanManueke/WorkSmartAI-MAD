import LetterAvatar from '@/components/ui/LetterAvatar';
import { api } from '@/convex/_generated/api';
import { useUserStore } from '@/stores';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUserStore();

  // Ambil data pekerjaan yang disimpan dari Convex
  const savedJobs = useQuery(api.bookmarks.getSavedJobs, {
    userId: user?._id as any
  }) || [];

  const handleLogout = () => {
    Alert.alert(
      "Keluar Akun",
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Keluar",
          style: "destructive",
          onPress: () => {
            logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Modern Header Profile */}
        <LinearGradient
          colors={['#1A73E8', '#00C896']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.profileHeaderRow}>
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatarImage}
              />
            ) : (
              <LetterAvatar
                name={user?.name || 'User'}
                size={80}
                style={styles.avatarBorder}
              />
            )}
            <View style={styles.headerInfo}>
              <Text style={styles.userNameText}>{user?.name || 'User Name'}</Text>
              <Text style={styles.userRoleText}>{user?.role === 'admin' ? 'Administrator' : 'Pencari Kerja'}</Text>
              <View style={styles.locationBadge}>
                <Ionicons name="location" size={12} color="#FFFFFF" />
                <Text style={styles.locationText}>{(user as any)?.location || 'Manado, Indonesia'}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.settingsIcon}
              onPress={() => Alert.alert("Pengaturan", "Fitur personalisasi aplikasi akan segera hadir di versi berikutnya.")}
            >
              <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <StatBox
              label="Tersimpan"
              value={savedJobs.length.toString()}
              onPress={() => router.push('/(tabs)/saved')}
            />
            <View style={styles.statDivider} />
            <StatBox
              label="Aplikasi"
              value="0"
              onPress={() => Alert.alert("Aplikasi", "Belum ada lamaran aktif.")}
            />
          </View>
        </LinearGradient>

        {/* Action Menu Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Akun & Keamanan</Text>
          <View style={styles.menuCard}>
            <MenuAction
              icon="person-outline"
              title="Edit Profil & Resume"
              color="#1A73E8"
              onPress={() => router.push('/(tabs)/resume')}
            />
            <MenuAction
              icon="sparkles-outline"
              title="Analisis Profil dengan AI"
              color="#9C27B0"
              onPress={() => router.push({ pathname: '/ai-chat', params: { mode: 'analyze', data: JSON.stringify(user) } })}
            />
            <MenuAction
              icon="shield-checkmark-outline"
              title="Keamanan Akun (Ganti Password)"
              color="#34A853"
              onPress={() => router.push('/change-password')}
            />
            <MenuAction
              icon="notifications-outline"
              title="Notifikasi Pekerjaan"
              color="#FBBC05"
              onPress={() => Alert.alert("Notifikasi", "Pengaturan notifikasi akan tersedia setelah fitur push-notification diaktifkan.")}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Dukungan & Info</Text>
          <View style={styles.menuCard}>
            <MenuAction
              icon="help-circle-outline"
              title="Pusat Bantuan"
              color="#5F6368"
              onPress={() => Alert.alert("Bantuan", "Kirim pesan ke tim kami di support@worksmart.ai atau via WhatsApp +62 812-xxxx-xxxx")}
            />
            <MenuAction
              icon="information-circle-outline"
              title="Tentang WorkSmartAI"
              color="#5F6368"
              onPress={() => Alert.alert("WorkSmartAI", "Versi 1.0.0 (Alpha Build)\n\nPlatform cerdas untuk pencari kerja di Sulawesi Utara.")}
            />
            <MenuAction
              icon="log-out-outline"
              title="Keluar Akun"
              color="#EA4335"
              isLast
              onPress={handleLogout}
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, value, onPress }: { label: string, value: string, onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.statBox} disabled={!onPress} onPress={onPress}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabelText}>{label}</Text>
    </TouchableOpacity>
  );
}

function MenuAction({ icon, title, color, isLast, onPress }: { icon: any, title: string, color: string, isLast?: boolean, onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={[styles.menuText, title === 'Keluar Akun' && { color: '#EA4335' }]}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#DADCE0" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  profileCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarBorder: {
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  userRoleText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginTop: 2,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 11,
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '700',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statLabelText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5F6368',
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F3F4',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#202124',
  }
});


