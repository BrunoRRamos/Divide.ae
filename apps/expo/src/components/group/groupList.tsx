import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";

import { api } from "~/utils/api";
import { GroupListItem } from "./groupListItem";

export function GroupList() {
  const groupListQuery = api.group.get.many.useQuery();

  return (
    <View className="flex flex-col gap-2">
      <View className="flex w-full flex-row justify-between">
        <Text className="text-lg font-semibold">My groups</Text>
        <Link href={{ pathname: "/group/code" }} asChild>
          <TouchableOpacity>
            <Plus size={24} color="black" />
          </TouchableOpacity>
        </Link>
      </View>
      <FlatList
        data={groupListQuery.data}
        renderItem={({ item }) => <GroupListItem key={item.id} group={item} />}
      />
    </View>
  );
}
