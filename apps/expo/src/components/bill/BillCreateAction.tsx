import type { ReactNode } from "react";
import { Fragment, useCallback, useRef } from "react";
import toast from "react-native-toast-message";
import * as Slot from "@rn-primitives/slot";

import type { BottomSheetModal } from "@gorhom/bottom-sheet";

import type { BillFormProps } from "./BillForm";
import { api } from "~/utils/api";
import { notifyError } from "~/utils/error";
import { BillBottomSheet } from "./BillBottomSheet";

interface BillCreateActionProps {
  trigger: ReactNode;
  groupId: string;
}

export function BillCreateAction({ groupId, trigger }: BillCreateActionProps) {
  const utils = api.useUtils();
  const billCreateMutation = api.bill.create.one.useMutation();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleSubmit: BillFormProps["onSubmit"] = async (data) => {
    try {
      await billCreateMutation.mutateAsync({
        ...data,
        groupId,
      });

      await utils.group.get.one.invalidate();

      bottomSheetRef.current?.close();
      toast.show({ type: "success", text1: "Bill updated successfully" });
    } catch (e) {
      notifyError(e);
    }
  };

  return (
    <Fragment>
      <BillBottomSheet onSubmit={handleSubmit} ref={bottomSheetRef} />
      <Slot.Pressable onPress={handleOpenBottomSheet}>{trigger}</Slot.Pressable>
    </Fragment>
  );
}
