import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const { startSSOFlow } = useSSO(); // Use the useSSO hook
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      // Create a new session and start the SSO flow
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
      });

      // If the user is signed in, redirect to the home screen
      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId }); // Set the active session
        router.replace("/(tabs)"); // Redirect to the home screen
      }
    } catch (error) {
      console.log("OAuth error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Brand Section */}
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons
            name='leaf'
            size={32}
            color={COLORS.primary}
          />
        </View>
        <Text style={styles.appName}>Spotlight</Text>
        <Text style={styles.tagline}>Don't miss anything</Text>
      </View>

      {/* Illustration Section */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/images/auth-bg-2.png")}
          resizeMode='cover'
          style={styles.illustration}
        />
      </View>

      {/* Login Section */}
      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons
              name='logo-google'
              size={20}
              color={COLORS.surface}
            />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </View>
  );
}
