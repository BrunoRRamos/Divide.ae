import { useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import toast from "react-native-toast-message";
import { Link } from "expo-router";
import { Download } from "lucide-react-native";

import type { Group } from "~/app/group/[id]";
import { supabase } from "~/lib/supabase";
import { Button, Text } from "../ui";

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
            return <GroupItem item={item} key={item.id} />;
          }}
        />
      ) : (
        <Text>No payments yet</Text>
      )}
    </View>
  );
}

type Payment = GroupBillsProps["group"]["payments"][number];

interface GroupItemProps {
  item: Payment;
}

export function GroupItem({ item }: GroupItemProps) {
  const [link, setLink] = useState<string | null>(null);

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  const onDownload = async () => {
    const { data, error } = await supabase.storage
      .from("payments")
      .download(item.receipts?.fileName ?? "");

    if (error) {
      toast.show({ type: "error", text1: error.message });
      return;
    }

    const url = URL.createObjectURL(data);
    setLink(url);
  };

  return (
    <View className="mb-2 flex w-full flex-row items-center justify-between rounded-lg border px-2 py-4 text-lg">
      <Text>{item.createdAt.toLocaleDateString()}</Text>
      <Text className="font-semibold">{formatter.format(item.value)}</Text>
      <a href={link ?? ""} target="_blank">
        <Button onPress={onDownload}>
          <Download size={16} color="black" />
        </Button>
      </a>
    </View>
  );
}
