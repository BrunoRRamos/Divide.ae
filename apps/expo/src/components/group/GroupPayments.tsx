import { View } from "react-native";
import { Link } from "expo-router";

import type { Group } from "~/app/group/[id]";
import { Button, Text } from "../ui";

interface GroupBillsProps {
  group: Group;
}

export function GroupPayments({ group }: GroupBillsProps) {
  return (
    <View>
      <Text>payments</Text>
      <Link
        href={{
          pathname: "/group/[id]/payments/method",
          params: { id: group.id },
        }}
        asChild
      >
        <Button>
          <Text>Send payment receipt</Text>
        </Button>
      </Link>
    </View>
  );
}
