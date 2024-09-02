import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

import { SignInForm } from "~/components/auth/signInForm";
import { Text } from "~/components/ui";

export default function SignInPage() {
  return (
    <SafeAreaView>
      <View className="flex h-full justify-center gap-10">
        <SignInForm />
        <View className="flex flex-col items-center gap-2">
          <Text>Don't have an account?</Text>
          <Link href="/sign-up">
            <Text>Sign up</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
