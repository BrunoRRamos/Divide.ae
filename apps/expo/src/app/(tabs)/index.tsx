import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Link, Redirect } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { ArrowRight, Bell, LogOut } from "lucide-react-native";

import { ScreenView } from "~/components/layout/ScreenView";
import { Button, Text } from "~/components/ui";
import { formatCurrency } from "~/lib/currency";
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

  const { data: userData, isLoading: userQueryLoading } =
    api.user.get.one.useQuery({
      clerkId: user?.id,
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
      .map((word) => word[0] + (word[1] ?? ""))
      .join("")
      .toUpperCase();
    return initials;
  };

  const userName = user?.username ?? "";
  const userInitials = getInitials(userName);
  const groupListQuery = api.group.get.many.useQuery();

  return (
    <ScreenView>
      <View className="mb-4 mt-4 flex flex-row items-center justify-between">
        <View className="flex flex-row items-center">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-300">
            <Text>{userInitials}</Text>
          </View>
          <View className="ml-2">
            <Text className="text-lg text-black">Hello, {userName}</Text>
            <Text className="mt-1 text-sm text-gray-600">Welcome!</Text>
          </View>
        </View>
        <View className="flex flex-row items-center">
          <TouchableOpacity onPress={() => console.log("Notificações")}>
            <Bell size={24} color="black" />
          </TouchableOpacity>
          <Button variant="link" onPress={handleSignOut} loading={loading}>
            <LogOut size={24} color={"#950101"} />
          </Button>
        </View>
      </View>
      <View className="flex flex-col gap-2">
        <Text className="text-xl text-black">Pending payments</Text>
        <Text className="mb-9 text-2xl font-bold text-black">
          {userQueryLoading
            ? "Loading..."
            : `${formatCurrency(userData?.pendingValue ?? 0)}`}
        </Text>
      </View>
      {userQueryLoading || groupListQuery.isLoading ? (
        <Text>Loading Groups</Text>
      ) : groupListQuery.data?.length === 0 ? (
        <View className="mt-8 items-center justify-between">
          <Text>No groups</Text>
        </View>
      ) : (
        <FlatList
          data={groupListQuery.data}
          renderItem={({ item: group }) => {
            return (
              <Link
                asChild
                href={{ pathname: "/group/[id]", params: { id: group.id } }}
              >
                <TouchableOpacity>
                  <View className="mb-4 rounded-md border border-gray-300 p-4">
                    <Text className="text-lg text-black">{group.name}</Text>
                    <Text className="text-sm text-gray-600">Open</Text>
                    <View className="mt-2 flex flex-row items-center justify-between">
                      <Text className="text-lg font-bold text-black">
                        {formatCurrency(group.totalValue)}
                      </Text>
                      <Text className="text-sm font-bold">
                        til{" "}
                        {new Date(group.createdAt).toLocaleDateString("PT-BR")}
                      </Text>
                    </View>
                    <View className="mt-2 items-end">
                      <ArrowRight size={20} color={"#000"} />
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            );
          }}
        />
      )}
    </ScreenView>
  );
}
