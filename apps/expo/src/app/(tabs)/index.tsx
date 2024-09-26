import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Link, Redirect } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import {
  LucideArrowRight,
  LucideHouse,
  LucideLogOut,
  LucidePlus,
  LucideSearch,
} from "lucide-react-native";

import { ScreenView } from "~/components/layout/ScreenView";
import { Button, Text } from "~/components/ui";
import { api } from "~/utils/api";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const clerk = useAuth();

  const handleSignOut = async () => {
    setLoading(true);
    await clerk.signOut();
    setLoading(false);
  };

  const paymentQuery = api.payment.get.many.user.useQuery(user?.id!, {
    enabled: !!user?.id,
  });

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
  const groupListQuery = api.group.get.many.useQuery();

  return (
    <View className="flex-1 bg-white p-6">
      <View className="mb-4 mt-4 flex flex-row items-center justify-between">
        <View className="flex flex-row items-center">
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
        <View className="flex flex-row items-center">
          <Button variant="link" onPress={handleSignOut} loading={loading}>
            <LucideLogOut size={24} color={"#950101"} />
          </Button>
        </View>
      </View>

      <Text className="mb-4 text-xl text-black">Pagamentos Pendentes</Text>
      <Text className="mb-9 text-2xl font-bold text-black">
        {paymentQuery.isLoading
          ? "Carregando..."
          : `R$ ${groupListQuery.data
              ?.reduce((sum, payment) => sum + payment.fixedTax!, 0)
              .toFixed(2)}`}
      </Text>

      <ScrollView className="flex-1">
        {paymentQuery.isLoading ? (
          <Text>Carregando pagamentos...</Text>
        ) : groupListQuery.data?.length === 0 ? (
          <View className="mt-8 items-center justify-between">
            <Text>Não há pagamentos pendentes</Text>
          </View>
        ) : (
          groupListQuery.data?.map((group) => (
            <View
              key={group.id}
              className="mb-4 rounded-md border border-gray-300 p-4"
            >
              <Text className="text-lg text-black">{group.name}</Text>
              <Text className="text-sm text-gray-600">Aberto</Text>

              <View className="mt-2 flex flex-row items-center justify-between">
                <Text className="text-lg font-bold text-black">
                  R$ {group.fixedTax!.toFixed(2)}
                </Text>
                <Text className="text-sm font-bold">
                  até {new Date(group.createdAt).toLocaleDateString("PT-BR")}
                </Text>
              </View>

              <View className="mt-2 items-end">
                <Link
                  href={{ pathname: "/group/[id]", params: { id: group.id } }}
                  asChild
                >
                  <TouchableOpacity onPress={() => console.log("Seta clicada")}>
                    <LucideArrowRight size={20} color={"#000"} />
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View className="mb-2 h-px bg-gray-300" />

      {/*   <FlatList
        data={groupListQuery.data}
        renderItem={({ item }) => <GroupListItem key={item.id} group={item} />}
      /> */}

      <View className="flex flex-row justify-around py-4">
        <TouchableOpacity onPress={() => console.log("Home")}>
          <LucideHouse size={24} color={"#000"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Add Payment")}>
          <LucidePlus size={24} color={"#000"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Search")}>
          <LucideSearch size={24} color={"#000"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
