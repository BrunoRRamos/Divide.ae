import { forwardRef, useEffect, useId, useMemo, useRef } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Portal } from "@rn-primitives/portal";
import mergeRefs from "merge-refs";

import type { Bill } from "./BilItem";
import type { BillFormProps } from "./BillForm";
import { useKeyboard } from "~/hooks/useKeyboard";
import { BillForm } from "./BillForm";

interface BillBottomSheetProps {
  bill?: Bill;
  onSubmit: BillFormProps["onSubmit"];
}

export const BillBottomSheet = forwardRef<
  BottomSheetModal,
  BillBottomSheetProps
>(({ bill, onSubmit }, ref) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const id = useId();

  const { isKeyboardVisible } = useKeyboard();
  const snapPoints = useMemo(() => ["60%", "80%", "100%"], []);

  useEffect(() => {
    if (isKeyboardVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.collapse();
    }
  }, [isKeyboardVisible]);

  return (
    <Portal name={id}>
      <BottomSheetModal
        ref={mergeRefs(ref, bottomSheetRef)}
        snapPoints={snapPoints}
        index={0}
        backdropComponent={(props) => (
          <BottomSheetBackdrop disappearsOnIndex={-1} {...props} />
        )}
      >
        <BottomSheetView className="flex w-full flex-1 gap-4 p-6">
          <BillForm bill={bill} onSubmit={onSubmit} />
        </BottomSheetView>
      </BottomSheetModal>
    </Portal>
  );
});
