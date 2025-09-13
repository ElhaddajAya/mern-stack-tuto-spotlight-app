// This file handles authentication (Clerk) and database access (Convex)

import { ClerkProvider, useAuth } from "@clerk/clerk-expo"; // Changed: import useAuth from clerk-expo, not clerk-react
import { tokenCache } from "@clerk/clerk-expo/token-cache"; // Added: token cache for better performance
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";

// Fixed: Use EXPO_PUBLIC_CONVEX_URL instead of VITE_CONVEX_URL for Expo projects
const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL as string
);

export default function ClerkAndConvexProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get publishable key from environment variable for security
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Error handling for missing environment variables
  if (!publishableKey) {
    throw new Error(
      "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in environment variables"
    );
  }

  if (!process.env.EXPO_PUBLIC_CONVEX_URL) {
    throw new Error("Missing EXPO_PUBLIC_CONVEX_URL in environment variables");
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey} // Use environment variable instead of hardcoded key
      tokenCache={tokenCache} // Added: improves performance by caching tokens
    >
      <ConvexProviderWithClerk
        client={convex}
        useAuth={useAuth} // This useAuth is now from clerk-expo, which matches the ClerkProvider
      >
        {children} {/* Removed ClerkLoaded wrapper - it's not necessary here */}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
