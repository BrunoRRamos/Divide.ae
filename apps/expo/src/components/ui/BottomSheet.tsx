import BottomSheet from "@gorhom/bottom-sheet";
import { cssInterop } from "nativewind";

declare module "@gorhom/bottom-sheet" {
  interface BottomSheetProps {
    className?: string;
    backgroundClassName?: string;
    containerClassName?: string;
  }
}

cssInterop(BottomSheet, {
  className: {
    target: "style",
  },
  backgroundClassName: {
    target: "backgroundStyle",
  },
  containerClassName: {
    target: "containerStyle",
  },
});

export { BottomSheet };
