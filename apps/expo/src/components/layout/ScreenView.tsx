import type { ComponentProps } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
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
  avoidKeyboard = true,
  ...props
}: ScreenViewProps) {
  // const Component = Platform.OS === "ios" ? View : SafeAreaView;
  const Component = SafeAreaView;

  return (
    <Component>
      <KeyboardAvoidingView
        enabled={avoidKeyboard}
        behavior="position"
        accessible={false}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            className={cn("flex h-screen gap-6 bg-white p-6", className)}
            {...props}
          >
            {children}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Component>
  );
}
