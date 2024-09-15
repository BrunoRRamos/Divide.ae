import React from "react";
import { View } from "react-native";
import { Link } from "expo-router";

import { SignInForm } from "~/components/auth/signInForm";
import { Logo } from "~/components/layout/Logo";
import { ScreenView } from "~/components/layout/ScreenView";
import { Text } from "~/components/ui";

export default function SignInPage() {
  return (
    <ScreenView className="flex h-full justify-center gap-10" avoidKeyboard>
      <Logo />
      <SignInForm />
      <View className="flex flex-col items-center gap-2">
        <Text>Don't have an account?</Text>
        <Link href="/sign-up">
          <Text>Sign up</Text>
        </Link>
      </View>
    </ScreenView>
  );
}
