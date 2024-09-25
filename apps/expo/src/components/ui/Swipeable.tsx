import type { ComponentProps, ReactNode } from "react";
import type { SharedValue } from "react-native-reanimated";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";

import { cn } from "~/lib/utils";

interface RenderActionsProps {
  drag: SharedValue<number>;
  children?: ReactNode;
}

export function SwipeableActions({ drag, children }: RenderActionsProps) {
  const animationStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drag.value }],
  }));

  return (
    <Reanimated.View
      style={animationStyle}
      className="right-1/2 w-1/2 flex-row items-center justify-center"
    >
      {children}
    </Reanimated.View>
  );
}

export function SwipeableAction({
  children,
  className,
  ...props
}: ComponentProps<typeof Reanimated.View>) {
  return (
    <Reanimated.View
      className={cn("h-full flex-1 items-center", className)}
      {...props}
    >
      {children as ReactNode}
    </Reanimated.View>
  );
}