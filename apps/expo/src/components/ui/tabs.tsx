import * as React from "react";
import * as TabsPrimitive from "@rn-primitives/tabs";

import { TextClassContext } from "~/components/ui/text";
import { cn } from "~/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("flex h-12 flex-row justify-center gap-4", className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const { value } = TabsPrimitive.useRootContext();

  return (
    <TextClassContext.Provider
      value={cn(
        "text-xl font-medium text-gray-500",
        value === props.value && "text-gray-800",
      )}
    >
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex-grow items-center justify-center rounded-sm border-b-2 border-transparent py-1.5 text-sm font-medium shadow-none",
          props.disabled && "opacity-50",
          props.value === value && "border-b-2 border-gray-800",
          className,
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>((props, ref) => <TabsPrimitive.Content ref={ref} {...props} />);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
