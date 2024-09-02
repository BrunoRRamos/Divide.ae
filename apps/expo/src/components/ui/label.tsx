import * as React from "react";
import * as LabelPrimitive from "@rn-primitives/label";

import { cn } from "~/lib/utils";
import { Text } from "./text";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Text>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Text>
>(
  (
    {
      children,
      className,
      onPress,
      onLongPress,
      onPressIn,
      onPressOut,
      ...props
    },
    ref,
  ) => (
    <LabelPrimitive.Root
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <LabelPrimitive.Text
        ref={ref}
        className={cn(
          "text-base font-medium leading-none text-foreground",
          className,
        )}
        {...props}
      >
        <Text>{children}</Text>
      </LabelPrimitive.Text>
    </LabelPrimitive.Root>
  ),
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
