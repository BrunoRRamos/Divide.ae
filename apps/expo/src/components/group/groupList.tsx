import { FlatList, Text, View } from "react-native";

import { api } from "~/utils/api";
import { GroupListItem } from "./groupListItem";

export function GroupList() {
  const groupListQuery = api.group.get.many.useQuery();

  return (
    <View className="flex flex-col gap-2">
      <Text className="text-lg font-semibold">My groups</Text>
      <FlatList
        data={groupListQuery.data}
        renderItem={({ item }) => <GroupListItem key={item.id} group={item} />}
      />
    </View>
  );
}
