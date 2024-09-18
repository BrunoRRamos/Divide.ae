import toast from "react-native-toast-message";
import { TRPCClientError } from "@trpc/client";

export const notifyError = (e: unknown) => {
  if (e instanceof TRPCClientError) {
    toast.show({ type: "error", text1: e.message });
  } else {
    toast.show({
      type: "error",
      text1: "Unknown error, please contact our support",
    });
  }
};
