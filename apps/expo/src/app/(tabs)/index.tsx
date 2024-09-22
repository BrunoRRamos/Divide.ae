import { View } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import { GroupList } from "~/components/group/groupList";
import { ScreenView } from "~/components/layout/ScreenView";
import { Text } from "~/components/ui";

export default function Home() {
  const clerk = useAuth();

  if (!clerk.isLoaded) {
    return (
      <ScreenView>
        <View className="flex h-full flex-col items-center justify-center">
          <Text>loading</Text>
        </View>
      </ScreenView>
    );
  }

  if (!clerk.isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <ScreenView>
      <GroupList />
    </ScreenView>
  );
}
