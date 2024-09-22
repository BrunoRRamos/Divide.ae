import { useMemo, useState } from "react";
import { View } from "react-native";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";

import type { HandleSubmit, ValidationSchema } from "../form/types";
import type { Bill } from "./BilItem";
import { TextField } from "../form/TextField";
import { Button, Text } from "../ui";

const validationSchema = yup.object().shape({
  name: yup.string().required("Please enter a name"),
  value: yup
    .number()
    .test(
      "gtz",
      "Value must be greater than zero",
      (value) => Number(value) > 0,
    )
    .required("Please enter a value"),
  quantity: yup
    .number()
    .test(
      "gtz",
      "Quantity must be greater than zero",
      (value) => Number(value) > 0,
    )
    .required("Please enter a quantity"),
  description: yup.string().optional().max(100, "Description is too long"),
});

export interface BillFormProps {
  onSubmit: HandleSubmit<typeof validationSchema>;
  bill?: Bill;
}

export function BillForm({ onSubmit, bill }: BillFormProps) {
  const [loading, setLoading] = useState(false);

  const initialValues = useMemo<ValidationSchema<typeof validationSchema>>(
    () => ({
      name: bill?.name ?? "",
      value: bill?.value ?? 0,
      quantity: bill?.quantity ?? 1,
      description: bill?.description ?? "",
    }),
    [bill],
  );

  const form = useFormik({
    initialValues,
    onSubmit: async (data, helpers) => {
      setLoading(true);
      const cleanData = {
        ...data,
        quantity: Number(data.quantity),
        value: Number(data.value),
      };

      await onSubmit(cleanData, helpers);
      setLoading(false);
    },
    validationSchema,
  });

  return (
    <FormikProvider value={form}>
      <View className="flex flex-1 gap-4 pb-10">
        <TextField label="Name" name="name" />
        <View className="flex-row gap-4">
          <TextField
            currency
            keyboardType="numeric"
            label="Value"
            name="value"
            containerClassName="flex-1"
          />
          <TextField
            keyboardType="numeric"
            label="Quantity"
            name="quantity"
            containerClassName="flex-1"
          />
        </View>
        <TextField
          label="Description (optional)"
          name="description"
          multiline
          className="h-40 align-top"
        />
        <Button onPress={() => form.handleSubmit()} loading={loading}>
          <Text>Save</Text>
        </Button>
      </View>
    </FormikProvider>
  );
}
