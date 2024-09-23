import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import toast from "react-native-toast-message";
import * as Camera from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Camera as CameraIcon,
  FileText,
  Upload,
} from "lucide-react-native";

import { ScreenView } from "~/components/layout/ScreenView";
import { Button } from "~/components/ui";
import { supabase } from "~/lib/supabase";
import { api } from "~/utils/api";

export default function PaymentReceipt() {
  const [uploading, setUploading] = useState(false);
  const [asset, setAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const params = useLocalSearchParams();
  const groupId = (params.id ?? "") as string;

  const { mutateAsync: createReceipt } = api.receipt.create.one.useMutation();

  const { mutateAsync: createPayment } = api.payment.create.one.useMutation();

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        toast.show({
          type: "error",
          text1: "Please grant galery permissions",
        });
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
        setAsset(asset);
      } else {
        toast.show({ type: "error", text1: "Could not get image URI" });
      }
    } else {
      toast.show({ type: "error", text1: "No image selected" });
    }
  };

  const camera = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        toast.show({
          type: "error",
          text1: "Please grant camera permissions",
        });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (
        !result.canceled &&
        result.assets.length &&
        result.assets.length > 0
      ) {
        const asset = result.assets[0];
        if (asset) {
          setAsset(asset);
        } else {
          toast.show({ type: "error", text1: "Could not get image URI" });
        }
      }
    }
  };

  const uploadImage = async (image: ImagePicker.ImagePickerAsset) => {
    try {
      setUploading(true);
      const filePath = `${image.fileName}`;

      if (!image.uri) {
        toast.show({ type: "error", text1: "Could not get image URI" });
      }

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer(),
      );

      await supabase.storage.from("payments").upload(filePath, arraybuffer, {
        contentType: image.mimeType ?? "image/jpeg",
      });
    } catch {
      toast.show({
        type: "error",
        text1: "Unexpected error, please talk to the support",
      });
    } finally {
      setUploading(false);
    }
  };

  const onPressFinish = async () => {
    if (!asset) return;
    const { id } = await createPayment({
      groupId,
      value: 100,
    });
    await createReceipt({
      paymentId: id,
      fileName: asset.fileName ?? "",
      uri: asset.uri,
      ext: asset.type ?? "image/jpeg",
    });
    await uploadImage(asset);
    router.push({
      pathname: "/group/[id]/payments/success",
      params: { id: groupId },
    });
  };

  return (
    <ScreenView className="flex justify-center">
      <TouchableOpacity
        onPress={() => {
          router.push("/");
        }}
        className="absolute left-2 top-2"
      >
        <ArrowLeft size={32} color="black" />
      </TouchableOpacity>
      <Text className="text-2xl font-semibold">Anexar comprovante</Text>
      <Text className="text-lg">Como deseja anexar o seu comprovante?</Text>
      <View className="flex w-full gap-4">
        <TouchableOpacity
          className="flex w-full flex-row items-center gap-2 rounded-lg border border-slate-200 p-4"
          onPress={pickImage}
        >
          <Upload size={24} color="gray" />
          <Text className="text-lg">Inserir arquivo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex w-full flex-row items-center gap-2 rounded-lg border border-slate-200 bg-white p-4"
          onPress={camera}
        >
          <CameraIcon size={24} color="gray" />
          <Text className="text-lg">Tirar foto</Text>
        </TouchableOpacity>
        <Camera.CameraView facing="back" className="flex-1"></Camera.CameraView>
      </View>
      <View className="mt-6">
        {asset ? (
          <View className="flex-row items-center">
            <FileText size={24} color="gray" />
            <Text className="ml-2 text-lg">
              Comprovante: {asset.fileName ?? "Foto anexada"}
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center">
            <FileText size={24} color="gray" />
            <Text className="ml-2 text-lg text-gray-500">
              Nenhum comprovante anexado
            </Text>
          </View>
        )}
      </View>
      <Button
        disabled={!asset}
        onPress={onPressFinish}
        loading={uploading}
        className={`mt-10 w-full items-center rounded-lg p-0`}
      >
        <Text className="text-lg">Finalizar</Text>
      </Button>
    </ScreenView>
  );
}
