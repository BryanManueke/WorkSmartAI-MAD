import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, FlatList, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import WorkButton from '../components/WorkButton';

const { width } = Dimensions.get('window');

const SLIDES = [
  { 
    id: '1', 
    title: 'Temukan Pekerjaan Impianmu', 
    desc: 'AI mencarikan peluang terbaik untukmu yang sesuai dengan keahlian unikmu.', 
    icon: 'search-outline',
    color: '#1A73E8'
  },
  { 
    id: '2', 
    title: 'Lengkapi Profilmu', 
    desc: 'Ceritakan keahlian dan tujuan kariermu agar AI bisa bekerja lebih akurat.', 
    icon: 'person-outline',
    color: '#00C896'
  },
  { 
    id: '3', 
    title: 'Raih Kariermu', 
    desc: 'Lamar lebih cerdas, bukan lebih keras. Tingkatkan hidupmu hari ini.', 
    icon: 'trending-up-outline',
    color: '#1A73E8'
  }
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      // @ts-ignore
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/login');
    }
  };

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => (
    <View style={styles.slide}>
      <View style={[styles.illustrationBox, { backgroundColor: item.color + '15' }]}>
        <Ionicons name={item.icon as any} size={100} color={item.color} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.desc}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Skip */}
      <View style={styles.header}>
        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={styles.skipText}>Lewati</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList 
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
      
      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 30, 10],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return <Animated.View key={i.toString()} style={[styles.dot, { width: dotWidth, opacity }]} />;
          })}
        </View>

        <WorkButton 
          title={currentIndex === SLIDES.length - 1 ? "Mulai Sekarang" : "Lanjut"} 
          onPress={handleNext} 
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
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5F6368',
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  illustrationBox: {
    width: 280,
    height: 280,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#202124',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#5F6368',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1A73E8',
    marginHorizontal: 4,
  }
});
