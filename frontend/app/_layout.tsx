import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="setup-profile" />
      <Stack.Screen name="category-jobs" />
      <Stack.Screen name="job-detail" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
