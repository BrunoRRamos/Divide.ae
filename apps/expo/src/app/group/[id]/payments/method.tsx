import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { CreditCard, DollarSign, QrCode } from "lucide-react-native";

import { ScreenView } from "~/components/layout/ScreenView";
import { Button } from "~/components/ui";

export default function PaymentMethods() {
  const [selected, setSelected] = useState<string | null>(null);

  const params = useLocalSearchParams();

  const handleSelect = (method: "Pix" | "Cartao" | "Dinheiro") => {
    setSelected(method);
  };

  return (
    <ScreenView className="flex justify-center gap-8 p-6">
      <Text className="text-xl">Qual será a forma de pagamento?</Text>
      <View className="flex flex-col gap-4 space-y-4">
        <TouchableOpacity
          onPress={() => handleSelect("Pix")}
          className={`flex flex-row items-center gap-2 rounded-lg border border-gray-200 p-4 ${
            selected === "Pix" ? "bg-gray-100" : "bg-white"
          }`}
        >
          <QrCode
            size={24}
            color={selected === "Pix" ? "#00bfa5" : "gray"} // TODO: fix color
          />
          <Text className="text-lg">Pix</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSelect("Cartao")}
          className={`flex flex-row items-center gap-2 rounded-lg border border-gray-200 p-4 ${
            selected === "Cartao" ? "bg-gray-100" : "bg-white"
          }`}
        >
          <CreditCard
            size={24}
            color={selected === "Cartao" ? "#00bfa5" : "gray"}
          />
          <Text className="text-lg">Cartão</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSelect("Dinheiro")}
          className={`flex flex-row items-center gap-2 rounded-lg border border-gray-200 p-4 ${
            selected === "Dinheiro" ? "bg-gray-100" : "bg-white"
          }`}
        >
          <DollarSign
            size={24}
            color={selected === "Dinheiro" ? "#00bfa5" : "gray"}
          />
          <Text className="text-lg">Dinheiro</Text>
        </TouchableOpacity>
      </View>
      <Button
        onPress={() => {
          router.push({
            pathname: "/group/[id]/payments/receipt",
            params: { id: params.id as string },
          });
        }}
        className="items-center rounded-lg p-4"
        disabled={!selected}
        variant="default"
      >
        <Text>Avançar</Text>
      </Button>
    </ScreenView>
  );
}
