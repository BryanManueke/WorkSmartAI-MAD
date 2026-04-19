import { View, Text, StyleSheet } from 'react-native';

export default function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name} Screen</Text>
      <Text style={styles.subtext}>Coming Soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#1A73E8' },
  subtext: { fontSize: 14, color: '#9AA0A6', marginTop: 8 }
});
