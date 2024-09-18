import { useMemo, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";

import type { HandleSubmit } from "../form/types";
import { TextField } from "../form/TextField";
import { Button, Text } from "../ui";

export function SignUpVerify() {
  const clerk = useSignUp();
  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object().shape({
    code: yup.string().required("Please enter your code"),
  });

  const handleSubmit: HandleSubmit<typeof validationSchema> = async (
    data,
    helpers,
  ) => {
    if (!clerk.isLoaded) {
      return;
    }

    setLoading(true);
    try {
      const attemptResult = await clerk.signUp.attemptEmailAddressVerification({
        code: data.code,
      });

      if (attemptResult.status === "complete") {
        await clerk.setActive({ session: attemptResult.createdSessionId });

        router.dismissAll();
        router.replace("/");
      }
    } catch (e) {
      if (isClerkAPIResponseError(e)) {
        switch (e.errors[0]?.code) {
          case "form_code_incorrect":
            helpers.setErrors({ code: "Incorrect code, please try again" });
            break;
          case "verification_already_verified":
            helpers.setErrors({
              code: "Code already verified",
            });
        }
      }
    }
    setLoading(false);
  };

  const initialValues = useMemo<yup.InferType<typeof validationSchema>>(
    () => ({ code: "" }),
    [],
  );

  const form = useFormik<yup.InferType<typeof validationSchema>>({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema,
  });

  return (
    <FormikProvider value={form}>
      <View className="flex flex-col gap-6">
        <TextField label="Code" name="code" />
        <Button onPress={() => form.handleSubmit()} loading={loading}>
          <Text>Verify</Text>
        </Button>
      </View>
    </FormikProvider>
  );
}
