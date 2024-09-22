import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import type { SharedValue } from "react-native-reanimated";
import { Pressable, View } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import type { Group } from "~/app/group/[id]";
import { useUser } from "~/hooks/useUser";
import { SwipeableAction, SwipeableActions, Typograhy } from "../ui";
import { DeleteBillAction } from "./BillDeleteAction";
import { EditBillAction } from "./BillEditAction";
import { BillIncrement } from "./BillIncrement";

export type Bill = Group["bills"][number];

interface BillItemProps {
  bill: Bill;
}

const renderRightActions = ({
  drag,
  swipeable,
  bill,
}: {
  drag: SharedValue<number>;
  swipeable: SwipeableMethods;
  bill: Bill;
}) => {
  return (
    <SwipeableActions drag={drag}>
      <SwipeableAction>
        <EditBillAction bill={bill} onPress={swipeable.close} />
      </SwipeableAction>
      <SwipeableAction>
        <DeleteBillAction billId={bill.id} onPress={swipeable.close} />
      </SwipeableAction>
    </SwipeableActions>
  );
};

export function BillItem({ bill }: BillItemProps) {
  const user = useUser();

  const canEdit = bill.userId === user?.id;

  return (
    <Swipeable
      friction={2}
      rightThreshold={40}
      enabled={canEdit}
      enableTrackpadTwoFingerGesture
      renderRightActions={(_, drag, swipeable) =>
        renderRightActions({ drag, swipeable, bill })
      }
    >
      <Pressable className="flex flex-row justify-between gap-1 rounded-l-md bg-gray-100 p-4">
        <View className="flex flex-1 gap-1">
          <Typograhy.Large numberOfLines={1}>{bill.name}</Typograhy.Large>
          <Typograhy.P numberOfLines={2}>{bill.description}</Typograhy.P>
        </View>
        <View className="flex-1 items-end gap-1">
          <Typograhy.Lead>
            {bill.quantity} x{" "}
            {new Intl.NumberFormat("default", {
              style: "currency",
              currency: "BRL",
            }).format(bill.value)}
          </Typograhy.Lead>
          <BillIncrement bill={bill} />
        </View>
      </Pressable>
    </Swipeable>
  );
}
