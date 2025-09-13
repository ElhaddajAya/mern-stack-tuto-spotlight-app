import { useAuth } from "@clerk/clerk-expo";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const { signOut } = useAuth();

  return (
    <View>
      <TouchableOpacity onPress={() => signOut()}>
        <Text>SignOut</Text>
      </TouchableOpacity>
    </View>
  );
}
