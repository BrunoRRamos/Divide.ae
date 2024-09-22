import { Text, View } from "react-native";

import type { Group } from "~/app/group/[id]";
import { Progress } from "../ui/Progress";
import { GroupMembers } from "./GroupMembers";

interface GroupDetailsProps {
  group: Group;
}

export function GroupDetails({ group }: GroupDetailsProps) {
  return (
    <View className="flex gap-2">
      <View className="flex gap-2">
        <Text className="text-sm">Total paid</Text>
        <View className="flex w-full flex-row justify-between gap-2">
          <Text className="text-4xl font-bold">
            {new Intl.NumberFormat("default", {
              currency: "BRL",
              style: "currency",
            }).format(group.totalPaid)}
          </Text>
          <GroupMembers group={group} />
        </View>
      </View>
      <View className="flex flex-row gap-1">
        <Text className="text">Total</Text>
        <Text className="font-medium">
          {new Intl.NumberFormat("default", {
            currency: "BRL",
            style: "currency",
          }).format(group.totalValue)}
        </Text>
      </View>
      <Progress value={group.totalPaid % 100} className="w-full" />
    </View>
  );
}
