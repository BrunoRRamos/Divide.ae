import { Fragment } from "react";
import { TouchableOpacity } from "react-native";
import toast from "react-native-toast-message";
import { Trash } from "lucide-react-native";

import { api } from "~/utils/api";
import { notifyError } from "~/utils/error";
import { ActionDialog, Typograhy } from "../ui";

interface DeleteBillActionProps {
  billId: string;
  onPress?: () => void;
}

export function DeleteBillAction({ billId, onPress }: DeleteBillActionProps) {
  const utils = api.useUtils();

  const deleteBillMutation = api.bill.delete.one.useMutation();

  const handleDeleteBill = async () => {
    try {
      await deleteBillMutation.mutateAsync({ billId });
      await utils.group.get.one.invalidate();

      toast.show({ type: "success", text1: "Bill deleted successfully" });
    } catch (e) {
      notifyError(e);
    }
  };

  return (
    <Fragment>
      <ActionDialog
        title="Delete bill"
        description="Are you sure you want to delete this bill?"
        onSubmit={handleDeleteBill}
        destructive
        async
        trigger={
          <TouchableOpacity
            className="flex h-full w-full items-center justify-center gap-2 bg-red-600"
            onPress={onPress}
          >
            <Trash className="text-white" />
            <Typograhy.H4 className="text-white">Delete</Typograhy.H4>
          </TouchableOpacity>
        }
      />
    </Fragment>
  );
}
