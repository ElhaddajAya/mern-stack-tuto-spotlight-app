import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/create.styles";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function create() {
  const { user } = useUser();
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const pickImage = () => {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name='arrow-back'
            size={28}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <View style={{ width: 28 }} />
      </View>

      <TouchableOpacity
        style={styles.emptyImageContainer}
        onPress={pickImage}
      >
        <Ionicons
          name='image-outline'
          size={48}
          color={COLORS.grey}
        />
        <Text style={styles.emptyImageText}>Tap to select an image</Text>
      </TouchableOpacity>
    </View>
  );
}
