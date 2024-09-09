import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button, Text } from "~/components/ui";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const clerk = useAuth();

  if (!clerk.isLoaded) {
    return (
      <SafeAreaView>
        <View className="flex h-full flex-col items-center justify-center">
          <Text>loading</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!clerk.isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <SafeAreaView>
      <Text>Home</Text>
      <Button
        variant="destructive"
        onPress={async () => {
          setLoading(true);
          await clerk.signOut();
          setLoading(false);
        }}
        loading={loading}
      >
        <Text>Sign out</Text>
      </Button>
    </SafeAreaView>
  );
}
