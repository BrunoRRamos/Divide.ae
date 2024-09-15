import type { ComponentProps } from "react";
import { Fragment } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  View,
} from "react-native";

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

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Component
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          accessible={false}
        >
          <View className={cn("flex h-full bg-white", className)} {...props}>
            {children}
          </View>
        </Component>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
