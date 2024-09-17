import React, { useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CreditCard, DollarSign, QrCode } from "lucide-react-native";

import { Button } from "~/components/ui";
import { supabase } from "~/lib/supabase";

const PaymentMethods = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSelect = (method: "Pix" | "Cartao" | "Dinheiro") => {
    setSelected(method);
  };

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        Alert.alert(
          "Desculpe, precisamos de permissão para acessar a galeria!",
        );
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset) {
        await uploadImage(asset);
      } else {
        Alert.alert("Erro", "Não foi possível obter a URI da imagem.");
      }
    } else {
      Alert.alert("Nenhuma imagem selecionada");
    }
  };

  const uploadImage = async (image: ImagePicker.ImagePickerAsset) => {
    try {
      setUploading(true);
      const filePath = `public/payments/${image.fileName}`;

      if (!image.uri) {
        Alert.alert("Erro desconhecido");
      }

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer(),
      );

      await supabase.storage.from("payments").upload(filePath, arraybuffer, {
        contentType: image.mimeType ?? "image/jpeg",
      });
    } catch {
      Alert.alert("An error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="flex justify-center gap-8 p-6">
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
        onPress={pickImage}
        className="items-center rounded-lg bg-gray-300 p-4"
        disabled={!selected}
        loading={uploading}
      >
        <Text>Avançar</Text>
      </Button>
    </View>
  );
};

export default PaymentMethods;
