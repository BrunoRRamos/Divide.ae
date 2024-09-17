import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Redirect } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { FontAwesome5 } from "@expo/vector-icons";

import { Button, Text } from "~/components/ui";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const clerk = useAuth();

  if (!clerk.isLoaded) {
    return (
      <ScreenView>
        <View className="flex h-full flex-col items-center justify-center">
          <Text>loading</Text>
        </View>
      </ScreenView>
    );
  }

  if (!clerk.isSignedIn) {
    return <Redirect href="/sign-in" />;
  }

  const getInitials = (name: string) => {
    const initials = name
      .split(" ")
      .map((word) => word[0] + (word[1] || ""))
      .join("")
      .toUpperCase();
    return initials;
  };

  const userName = user?.username!;
  const userInitials = getInitials(userName);

  return (
    <View className="flex-1 bg-white p-6">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="mt-4 flex-row items-center">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-300">
            <Text>{userInitials}</Text>
          </View>
          <View className="ml-2">
            <Text className="text-lg text-black">Olá, {userName}</Text>
            <Text className="mt-1 text-sm text-gray-600">
              Bem-vindo de novo!
            </Text>
          </View>
        </View>
        <View className="mb-4 flex-row items-center justify-end">
          <TouchableOpacity onPress={() => console.log("Notificações")}>
            <FontAwesome5 name="bell" size={24} />
          </TouchableOpacity>
          <Button
            variant="link"
            onPress={async () => {
              setLoading(true);
              await clerk.signOut();
              setLoading(false);
            }}
            loading={loading}
          >
            <FontAwesome5 name="sign-out-alt" size={24} color={"#950101"} />
          </Button>
        </View>
      </View>

      <Text className="mb-4 mt-4 text-xl text-black">Pagamentos Pendentes</Text>
      <Text className="mb-9 text-2xl font-bold text-black">R$ 537,50</Text>

      <ScrollView className="flex-1">
        <View className="mb-4 rounded-md border border-gray-300 p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg text-black">Aniversário de Caique</Text>
            <Text className="text-sm text-gray-600">Aberto</Text>
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-black">R$ 37,50</Text>
            <Text className="text-sm font-bold">até 27/02</Text>
          </View>

          <View className="mt-2 items-end">
            <TouchableOpacity onPress={() => console.log("Seta clicada")}>
              <FontAwesome5 name="arrow-right" size={16} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-4 rounded-md border border-gray-300 p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg text-black">Contas de casa</Text>
            <Text className="text-sm text-gray-600">Aberto</Text>
          </View>

          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-black">R$ 500,00</Text>
            <Text className="text-sm font-bold">até 27/02</Text>
          </View>

          <View className="mt-2 items-end">
            <TouchableOpacity onPress={() => console.log("Seta clicada")}>
              <FontAwesome5 name="arrow-right" size={16} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className="mb-2 h-px bg-gray-300" />

      <View className="flex-row justify-around py-4">
        <TouchableOpacity onPress={() => console.log("Home")}>
          <FontAwesome5 name="home" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Add Payment")}>
          <FontAwesome5 name="plus" size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Search")}>
          <FontAwesome5 name="search" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
