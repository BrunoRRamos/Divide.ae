import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { View } from "react-native";
import { ErrorMessage, Field, useFormikContext } from "formik";

import { Text } from "../ui";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const TextField = forwardRef<
  ElementRef<typeof Input>,
  ComponentPropsWithoutRef<typeof Input> & {
    name: string;
    label: string;
  }
>(({ name, label, ...props }, ref) => {
  const form = useFormikContext<Record<string, unknown>>();
  const value = form.values[name] as string | undefined;

  return (
    <View className="flex flex-col gap-1">
      <Label nativeID={name}>{label}</Label>
      <Field
        name={name}
        nativeID={name}
        onChangeText={form.handleChange(name)}
        onBlur={form.handleBlur(name)}
        value={value}
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
