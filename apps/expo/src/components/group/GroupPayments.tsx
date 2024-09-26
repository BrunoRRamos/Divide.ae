import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { documentDirectory, downloadAsync } from "expo-file-system";
import { Link } from "expo-router";
import { shareAsync } from "expo-sharing";
import { Download } from "lucide-react-native";

import type { Group } from "~/app/group/[id]";
import { formatCurrency } from "~/lib/currency";
import { supabase } from "~/lib/supabase";
import { Button, Text } from "../ui";
import { UserAvatar } from "../user/UserAvatar";

interface GroupBillsProps {
  group: Group;
}

export function GroupPayments({ group }: GroupBillsProps) {
  return (
    <View className="flex gap-4">
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
      {group.payments.length ? (
        <FlatList
          data={group.payments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return <PaymentItem item={item} key={item.id} />;
          }}
        />
      ) : (
        <Text>No payments yet</Text>
      )}
    </View>
  );
}

type Payment = GroupBillsProps["group"]["payments"][number];

interface PaymentItemProps {
  item: Payment;
}

export function PaymentItem({ item }: PaymentItemProps) {
  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  const onDownload = async () => {
    if (!item.receipts) {
      return;
    }

    const { data } = supabase.storage
      .from("payments")
      .getPublicUrl(item.receipts.fileName);

    const url = data.publicUrl;

    const result = await downloadAsync(
      url,
      documentDirectory + item.receipts.fileName,
    );

    void shareAsync(result.uri);
  };

  return (
    <View className="mb-2 flex w-full flex-row items-center justify-between gap-3 rounded-lg bg-gray-100 px-4 py-4 text-lg">
      <UserAvatar name={item.user.name} />
      <View>
        <Text className="text-lg">{item.user.name} made a payment of </Text>
        <Text className="text-xl font-semibold">
          {formatCurrency(item.value)}
        </Text>
      </View>
      <Button onPress={onDownload}>
        <Download size={16} color="black" />
      </Button>
    </View>
  );
}
