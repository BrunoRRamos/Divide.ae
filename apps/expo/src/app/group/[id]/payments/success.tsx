import React from "react";
import { Text, View } from "react-native";
import { CheckCircle } from "lucide-react-native";

import { ScreenView } from "~/components/layout/ScreenView";
import { Button } from "~/components/ui";

export default function PaymentSuccessScreen() {
  return (
    <ScreenView>
      <View className={`flex items-center justify-center gap-4 bg-white`}>
        <View>
          <CheckCircle size={100} color="green" />
        </View>
        <Text className={`text-xl font-bold text-black`}>
          Pagamento realizado com sucesso!
        </Text>
        <Button>
          <Text className="text-lg">Finalizar</Text>
        </Button>
      </View>
    </ScreenView>
  );
}
