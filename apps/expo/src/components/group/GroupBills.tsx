import { Text, View } from "react-native";

import { Group } from "~/app/group/[id]";

interface GroupBillsProps {
  group: Group;
}

export function GroupBills({ group }: GroupBillsProps) {
  return (
    <View>
      <Text>Bills</Text>
    </View>
  );
}
