import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

// This component is the root of the app, it verifies if the user is signed in or not
// and redirects to the login screen if not
export default function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    // Check if the first segment is "(auth)"
    const inAuthScreen = segments[0] === "(auth)";

    // If not signed in and not on the auth screen, redirect to the auth screen (login screen)
    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)/login");
    } else if (isSignedIn && inAuthScreen) {
      // If signed in and on the auth screen, redirect to the home screen
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn, segments]); // Fire effect when isLoaded, isSignedIn, or segments change

  // Return null if the component is not loaded
  if (!isLoaded) return null;

  // If everything successful, render the Stack
  return <Stack screenOptions={{ headerShown: false }} />;
}

// Used in app/_layout.tsx
