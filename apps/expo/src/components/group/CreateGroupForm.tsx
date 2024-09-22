import { useMemo } from "react";
import { Text, View } from "react-native";
import toast from "react-native-toast-message";
import { router } from "expo-router";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";

import type { HandleSubmit, ValidationSchema } from "../form/types";
import { api } from "~/utils/api";
import { notifyError } from "~/utils/error";
import { TextField } from "../form/TextField";
import { Button } from "../ui";

export function CreateGroupForm() {
  const { mutateAsync, isPending } = api.group.create.one.useMutation();
  const utils = api.useUtils();

  const validationSchema = yup.object().shape({
    name: yup.string().required("Please enter a name"),
    description: yup.string(),
  });

  const initialValues = useMemo<ValidationSchema<typeof validationSchema>>(
    () => ({ name: "", description: "" }),
    [],
  );

  const handleSubmit: HandleSubmit<typeof validationSchema> = async (data) => {
    try {
      const group = await mutateAsync({
        description: data.description,
        name: data.name,
      });
      toast.show({ type: "success", text1: "Group created!" });
      await utils.group.get.many.invalidate();

      router.replace({ pathname: "/group/[id]", params: { id: group.id } });
    } catch (e) {
      notifyError(e);
    }
  };

  const form = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <View className="flex flex-col gap-4">
      <FormikProvider value={form}>
        <TextField label="Name" name="name" />
        <TextField
          label="Description (optional)"
          name="description"
          multiline
          className="h-24 align-top"
        />
        <Button loading={isPending} onPress={() => form.handleSubmit()}>
          <Text>Continue</Text>
        </Button>
      </FormikProvider>
    </View>
  );
}
