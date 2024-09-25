import { useState } from "react";

import type { Group } from "~/app/group/[id]";
import { Tabs, TabsContent, TabsList, TabsTrigger, Text } from "../ui";
import { GroupBills } from "./GroupBills";
import { GroupPayments } from "./GroupPayments";

interface GroupTabsProps {
  group: Group;
}

export function GroupTabs({ group }: GroupTabsProps) {
  const [value, setValue] = useState("bills");

  return (
    <Tabs value={value} onValueChange={setValue} className="flex-1 gap-4">
      <TabsList className="flex-row">
        <TabsTrigger value="bills">
          <Text>Bills</Text>
        </TabsTrigger>
        <TabsTrigger value="payments">
          <Text>Payments</Text>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="bills" className="flex-1">
        <GroupBills group={group} />
      </TabsContent>
      <TabsContent value="payments">
        <GroupPayments group={group} />
      </TabsContent>
    </Tabs>
  );
}
