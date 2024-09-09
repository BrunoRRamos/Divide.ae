import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SignUpForm } from "~/components/auth/signUpForm";

export default function SignUpPage() {
  return (
    <SafeAreaView>
      <View className="flex h-full flex-col justify-center">
        <SignUpForm />
      </View>
    </SafeAreaView>
  );
}
