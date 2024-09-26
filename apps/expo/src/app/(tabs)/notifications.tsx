import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { useNavigation } from "@react-navigation/native";

export type RootStackParamList = {
  Home: undefined;
  Notifications: undefined;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

// Definindo o tipo para as notificações
interface Notification {
  id: number;
  title: string;
  body: string;
}

export default function Notifications() {
  // Tipo explícito definido para 'notifications'
  const notifications: Notification[] = []; // Substitua por notificações reais se houver
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="ml-2">
        <Text className="text-lg font-bold text-black">Notificações</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {notifications.length === 0 ? (
          <ScrollView className="flex-1">
            <View className="mt-8 items-center justify-between">
              <Text className="text-sm text-gray-500">
                Não há novas notificações
              </Text>
            </View>
          </ScrollView>
        ) : (
          notifications.map((notification) => (
            <View
              key={notification.id}
              className="mb-4 border-b border-gray-300 p-4"
            >
              <Text className="text-black">{notification.title}</Text>
              <Text className="text-gray-600">{notification.body}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
