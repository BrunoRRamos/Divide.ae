import { SectionList, View } from "react-native";

import type { Group } from "~/app/group/[id]";
import { formatCurrency } from "~/lib/currency";
import { Typograhy } from "../ui";
import { BillItem } from "./BilItem";

interface BillListProps {
  group: Group;
}

export function BillList({ group }: BillListProps) {
  const aggregatedBills = group.bills.reduce(
    (acc, bill) => {
      const colIndex = acc.findIndex(({ key }) => key === bill.userId);
      const col = acc[colIndex];

      if (!col) {
        return [...acc, { key: bill.userId, data: [bill] }];
      }

      const copy = [...acc];
      copy[colIndex]?.data.push(bill);

      return copy;
    },
    [] as { data: Group["bills"]; key: string }[],
  );

  return (
    <View className="flex-1">
      <SectionList
        sections={aggregatedBills}
        renderSectionHeader={({ section: { data } }) => {
          const user = data[0]?.user;
          const totalWithoutTax = data.reduce(
            (sum, bill) => sum + bill.value * bill.quantity,
            0,
          );
          const totalWithTax =
            totalWithoutTax * (1 + (group.variableTax ?? 0)) +
            (group.fixedTax ?? 0);

          return (
            <View className="-mb-2 mt-6 flex-row justify-between rounded-md bg-primary p-1 px-4">
              <Typograhy.Lead>{user?.name}'s bills </Typograhy.Lead>
              <Typograhy.H4>{formatCurrency(totalWithTax)}</Typograhy.H4>
            </View>
          );
        }}
        contentContainerClassName="flex gap-2"
        renderItem={({ item }) => <BillItem key={item.id} bill={item} />}
      />
    </View>
  );
}
