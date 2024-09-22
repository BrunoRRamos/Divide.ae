import { Fragment, useCallback, useRef } from "react";
import { TouchableOpacity } from "react-native";
import toast from "react-native-toast-message";
import { Edit } from "lucide-react-native";

import type { BottomSheetModal } from "@gorhom/bottom-sheet";

import type { Bill } from "./BilItem";
import type { BillFormProps } from "./BillForm";
import { api } from "~/utils/api";
import { notifyError } from "~/utils/error";
import { Typograhy } from "../ui";
import { BillBottomSheet } from "./BillBottomSheet";

interface EditBillActionProps {
  bill: Bill;
  onPress?: () => void;
}

export function EditBillAction({ bill, onPress }: EditBillActionProps) {
  const utils = api.useUtils();
  const billUpdateMutation = api.bill.update.one.useMutation();

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOpenBottomSheet = useCallback(() => {
    onPress?.();
    bottomSheetRef.current?.present();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit: BillFormProps["onSubmit"] = async (data) => {
    try {
      await billUpdateMutation.mutateAsync({
        id: bill.id,
        ...data,
      });

      await utils.group.get.one.invalidate();

      bottomSheetRef.current?.dismiss();
      toast.show({ type: "success", text1: "Bill updated successfully" });
    } catch (e) {
      notifyError(e);
    }
  };

  return (
    <Fragment>
      <BillBottomSheet
        bill={bill}
        onSubmit={handleSubmit}
        ref={bottomSheetRef}
      />
      <TouchableOpacity
        className="flex h-full w-full items-center justify-center gap-2 bg-gray-200"
        onPress={handleOpenBottomSheet}
      >
        <Edit className="text-gray-800" />
        <Typograhy.H4 className="text-gray-800">Edit</Typograhy.H4>
      </TouchableOpacity>
    </Fragment>
  );
}
