import { Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";

import type { RouterOutputs } from "@/api";

type Group = RouterOutputs["group"]["get"]["many"][0];

interface GroupListItemProps {
  group: Group;
}

export function GroupListItem({ group }: GroupListItemProps) {
  return (
    <View className="flex gap-2">
      <Link
        href={{ pathname: "/group/[id]", params: { id: group.id } }}
        asChild
      >
        <TouchableOpacity className="flex p-8">
          <Text>{group.name}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
