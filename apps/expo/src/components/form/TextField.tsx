import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { View } from "react-native";
import { ErrorMessage, Field, useFormikContext } from "formik";

import { cn } from "~/lib/utils";
import { Text } from "../ui";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const TextField = forwardRef<
  ElementRef<typeof Input>,
  ComponentPropsWithoutRef<typeof Input> & {
    name: string;
    label: string;
    containerClassName?: string;
  }
>(({ name, label, containerClassName, ...props }, ref) => {
  const form = useFormikContext<Record<string, unknown>>();
  const value = form.values[name] as string | undefined;

  const handleTextChange = (text: string, unmasked: string) => {
    if (props.currency) {
      props.onChangeText?.(text);
    } else if (props.mask) {
      form.handleChange(name)(unmasked);
    } else {
      form.handleChange(name)(text);
    }
  };

  const handleValueChange = (value: string) => {
    if (props.currency) {
      form.handleChange(name)(String(value || 0));
    }
  };

  return (
    <View className={cn("flex gap-1", containerClassName)}>
      <Label nativeID={name}>{label}</Label>
      <Field
        name={name}
        nativeID={name}
        onChangeValue={handleValueChange}
        onChangeText={handleTextChange}
        onBlur={form.handleBlur(name)}
        value={String(value)}
        ref={ref}
        component={Input}
        {...props}
      />
      <ErrorMessage name={name}>
        {(msg) => <Text className="text-destructive">{msg}</Text>}
      </ErrorMessage>
    </View>
  );
});
