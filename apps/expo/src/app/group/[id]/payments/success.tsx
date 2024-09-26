import React from "react";
import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { ScreenView } from "~/components/layout/ScreenView";
import { Button, Typograhy } from "~/components/ui";
import { CherckCircle } from "~/lib/icons";

export default function PaymentSuccessScreen() {
  const params = useLocalSearchParams();

  return (
    <ScreenView className="items-center justify-center">
      <View>
        <CherckCircle className="size-24 text-green-600" />
      </View>
      <Typograhy.Lead>Your payment was sent successfully!</Typograhy.Lead>
      <Button
        onPress={() =>
          router.push({
            pathname: "/group/[id]",
            params: { id: params.id as string },
          })
        }
      >
        <Text className="text-lg">Go back</Text>
      </Button>
    </ScreenView>
  );
}
