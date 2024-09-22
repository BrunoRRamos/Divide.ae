import React from "react";
import { Text, View } from "react-native";

import { CreateGroupForm } from "~/components/group/CreateGroupForm";
import { ScreenView } from "~/components/layout/ScreenView";

export default function CreateGroup() {
  return (
    <ScreenView className="flex-col justify-center gap-16">
      <View className="flex flex-col gap-2">
        <Text className="text-4xl font-semibold">Create a new group 🚀</Text>
        <Text className="text-xl text-muted">
          Set up your new group and start organizing your expenses
        </Text>
      </View>
      <View>
        <CreateGroupForm />
      </View>
    </ScreenView>
  );
}
