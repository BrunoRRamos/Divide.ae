import React from "react";
import { Text, View } from "react-native";

import { SignUpForm } from "~/components/auth/signUpForm";
import { ScreenView } from "~/components/layout/ScreenView";

export default function SignUpPage() {
  return (
    <ScreenView
      className="flex h-full flex-col justify-center gap-10"
      avoidKeyboard
    >
      <View className="flex flex-col gap-2">
        <Text className="self-center text-4xl">Sign up</Text>
        <Text className="self-center text-xl">
          Fill the form below to get started
        </Text>
      </View>
      <SignUpForm />
    </ScreenView>
  );
}
