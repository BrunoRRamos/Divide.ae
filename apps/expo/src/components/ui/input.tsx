import type { MaskInputProps } from "react-native-mask-input";
import * as React from "react";
import { TextInput } from "react-native";
import CurrencyInput from "react-native-currency-input";
import MaskInput from "react-native-mask-input";

import { cn } from "~/lib/utils";

interface BaseInputProps {
  className?: string;
  placeholderClassName?: string;
}

type TextInputProps = BaseInputProps &
  React.ComponentPropsWithoutRef<typeof TextInput>;

type MaskedInputProps = BaseInputProps & MaskInputProps;

type CurrencyInputProps = BaseInputProps &
  Omit<React.ComponentPropsWithoutRef<typeof CurrencyInput>, "value"> & {
    value?: number | null;
  };

type InputProps =
  | (TextInputProps & { mask?: never; currency?: false })
  | (MaskedInputProps & { mask: MaskedInputProps["mask"]; currency?: false })
  | (CurrencyInputProps & { mask?: never; currency: true });

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ mask, currency = false, ...props }, ref) => {
    const className = cn(
      "h-14 rounded-2xl border-2 border-gray-200 bg-background p-2 px-3 text-lg leading-[1.25] text-foreground file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus:border-primary lg:text-sm",
      props.editable === false && "opacity-50",
      props.className,
    );
    const placeholderClassName = cn(
      "text-muted-foreground",
      props.placeholderClassName,
    );

    if (!currency && !mask) {
      const onChangeText = props.onChangeText as (string: string) => void;

      return (
        <TextInput
          {...(props as TextInputProps)}
          onChangeText={onChangeText}
          ref={ref}
          className={className}
          placeholderClassName={placeholderClassName}
        />
      );
    }

    if (currency) {
      const { value, ...rest } = props as CurrencyInputProps;

      return (
        <CurrencyInput
          {...rest}
          ref={ref}
          prefix="R$ "
          value={value ?? null}
          className={className}
          placeholderClassName={placeholderClassName}
        />
      );
    }

    if (mask) {
      return (
        <MaskInput
          {...(props as MaskedInputProps)}
          mask={mask}
          ref={ref}
          className={className}
          placeholderClassName={placeholderClassName}
        />
      );
    }
  },
);

Input.displayName = "Input";

export { Input };
