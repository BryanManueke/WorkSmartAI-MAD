import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Stack } from 'expo-router';
import AIFloatingChat from '../components/AIFloatingChat';

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL || "https://dummy.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

export default function Layout() {
  return (
    <ConvexProvider client={convex}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
        <Stack.Screen name="setup-profile" />
        <Stack.Screen name="category-jobs" />
        <Stack.Screen name="job-detail" />
        <Stack.Screen name="change-password" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <AIFloatingChat />
    </ConvexProvider>
  );
}
