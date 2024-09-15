import type { ComponentProps } from "react";
import { Fragment } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { cn } from "~/lib/utils";

type ScreenViewProps = ComponentProps<typeof View> & {
  avoidKeyboard?: boolean;
};

export function ScreenView({
  className,
  children,
  avoidKeyboard,
  ...props
}: ScreenViewProps) {
  const Component = avoidKeyboard ? KeyboardAvoidingView : Fragment;
  const componentProps = avoidKeyboard
    ? {
        behavior:
          Platform.OS === "ios" ? ("padding" as const) : ("height" as const),
        accessible: false,
      }
    : {};

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Component {...componentProps}>
          <View
            className={cn("flex h-full gap-6 bg-white px-4", className)}
            {...props}
          >
            {children}
          </View>
        </Component>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
