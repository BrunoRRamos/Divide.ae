import type { ViewProps } from "react-native";
import { Fragment } from "react";
import { View } from "react-native";
import { Loader2 } from "lucide-react-native";

import { cn } from "~/lib/utils";

export function Loading({
  screen,
  className,
  ...props
}: ViewProps & { screen?: boolean }) {
  const Wrapper = screen ? View : Fragment;

  return (
    <Wrapper
      {...(screen
        ? { className: "flex size-full items-center justify-center" }
        : {})}
    >
      <View className={cn("animate-spin", className)} {...props}>
        <Loader2 color="black" />
      </View>
    </Wrapper>
  );
}
