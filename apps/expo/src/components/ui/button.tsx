import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Pressable, View } from "react-native";
import { cva } from "class-variance-authority";
import { CircleNotch } from "phosphor-react-native";

import { TextClassContext } from "~/components/ui/text";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "group flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary active:opacity-90",
        destructive: "bg-destructive active:opacity-90",
        outline: "border border-input bg-background active:bg-accent",
        secondary: "bg-secondary active:opacity-80",
        ghost: "active:bg-accent",
        link: "",
      },
      size: {
        default: "h-12 px-5 py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-14 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva("text-base font-medium text-foreground", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      destructive: "text-destructive-foreground",
      outline: "group-active:text-accent-foreground",
      secondary:
        "text-secondary-foreground group-active:text-secondary-foreground",
      ghost: "group-active:text-accent-foreground",
      link: "text-primary group-active:underline",
    },
    size: {
      default: "",
      sm: "",
      lg: "text-lg",
      icon: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(({ className, loading = false, variant, size, children, ...props }, ref) => {
  return (
    <TextClassContext.Provider
      value={cn(buttonTextVariants({ variant, size }))}
    >
      <Pressable
        className={cn(
          (loading || props.disabled) && "opacity-50",
          buttonVariants({ variant, size, className }),
        )}
        disabled={loading || props.disabled}
        ref={ref}
        role="button"
        {...props}
      >
        {(s) => (
          <View className="flex flex-row items-center gap-2">
            {loading && (
              <View className="animate-spin">
                <CircleNotch />
              </View>
            )}
            {typeof children === "function" ? children(s) : children}
          </View>
        )}
      </Pressable>
    </TextClassContext.Provider>
  );
});
Button.displayName = "Button";

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
