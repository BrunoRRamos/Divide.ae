import { Text, View } from "react-native";

import type { Group } from "~/app/group/[id]";
import { BillCreateAction } from "../bill/BillCreateAction";
import { BillList } from "../bill/BillList";
import { Button, Typograhy } from "../ui";

interface GroupBillsProps {
  group: Group;
}

export function GroupBills({ group }: GroupBillsProps) {
  const renderAddBillButton = () => {
    return (
      <BillCreateAction
        groupId={group.id}
        trigger={
          <Button>
            <Text>Add a bill</Text>
          </Button>
        }
      />
    );
  };

  if (group.bills.length === 0) {
    return (
      <View className="flex h-full items-center justify-center gap-6">
        <View className="flex gap-2">
          <Typograhy.H4 className="text-center">No bills yet</Typograhy.H4>
          <Typograhy.P className="text-center">
            Start off by adding one!
          </Typograhy.P>
        </View>
        {renderAddBillButton()}
      </View>
    );
  }

  return (
    <View className="flex h-full gap-4">
      <BillList group={group} />
      {renderAddBillButton()}
    </View>
  );
}
