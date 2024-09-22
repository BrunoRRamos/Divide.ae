import { useCallback, useRef } from "react";
import { View } from "react-native";

import type { Bill } from "./BilItem";
import type { Group } from "~/app/group/[id]";
import { useUser } from "~/hooks/useUser";
import { throttle } from "~/lib/delay";
import { Minus, Plus } from "~/lib/icons";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { notifyError } from "~/utils/error";
import { Button } from "../ui";

interface BillIncrementProps {
  bill: Bill;
  className?: string;
}

export function BillIncrement({ bill, className }: BillIncrementProps) {
  const user = useUser();

  const utils = api.useUtils();

  const initialQuantity = useRef<number>(bill.quantity);

  const updateBillMutation = api.bill.update.one.useMutation({
    onError: () => {
      utils.group.get.one.setData({ id: bill.id }, (group) =>
        group
          ? handleUpdateBillQuantity(group, initialQuantity.current)
          : undefined,
      );
    },
  });

  const handleUpdate = async (quantity: number) => {
    try {
      await updateBillMutation.mutateAsync({
        id: bill.id,
        quantity,
      });
    } catch (e) {
      notifyError(e);
    }
  };

  const handleUpdateBillQuantity = (group: Group, quantity: number) => {
    const updatedBills = group.bills.map((b) => {
      if (b.id === bill.id) {
        return { ...b, quantity };
      }

      return b;
    });

    return { ...group, bills: updatedBills };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledHandleUpdate = useCallback(throttle(handleUpdate, 1000), []);

  const handleOnPress = (type: "decrement" | "increment") => {
    const quantity = bill.quantity + (type === "increment" ? 1 : -1);

    const handleUpdateData = (group: Group | undefined | null) => {
      if (group) {
        return handleUpdateBillQuantity(group, quantity);
      }
    };

    utils.group.get.one.setData({ id: bill.groupId }, handleUpdateData);

    throttledHandleUpdate(quantity);
  };

  const canEdit = user?.id === bill.userId;

  return (
    <View className={cn("flex-row gap-4", className)}>
      <Button
        onPress={() => handleOnPress("decrement")}
        variant="outline"
        size="icon"
        disabled={bill.quantity === 1 || !canEdit}
      >
        <Minus className="size-5 text-gray-800" />
      </Button>
      <Button
        disabled={!canEdit}
        onPress={() => handleOnPress("increment")}
        variant="outline"
        size="icon"
      >
        <Plus className="size-4 text-gray-800" />
      </Button>
    </View>
  );
}
