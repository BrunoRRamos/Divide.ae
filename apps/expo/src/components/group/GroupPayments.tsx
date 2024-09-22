import { View } from "react-native";

import { Group } from "~/app/group/[id]";
import { Text } from "../ui";

interface GroupBillsProps {
  group: Group;
}

export function GroupPayments({ group }: GroupBillsProps) {
  return (
    <View>
      <Text>payments</Text>
    </View>
  );
}
