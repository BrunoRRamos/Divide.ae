import { useMemo, useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";

import type { HandleSubmit, ValidationSchema } from "../form/types";
import { Button, Text } from "~/components/ui";
import { TextField } from "../form/TextField";

export function SignInForm() {
  const [loading, setLoading] = useState(false);
  const clerk = useSignIn();

  const validationSchema = yup.object().shape({
    credential: yup.string().required("Please enter your credentials"),
    password: yup.string().required("Please enter your password"),
  });

  const initialValues = useMemo<ValidationSchema<typeof validationSchema>>(
    () => ({ credential: "", password: "" }),
    [],
  );

  const handleSubmit: HandleSubmit<typeof validationSchema> = async (
    values,
    helpers,
  ) => {
    if (!clerk.isLoaded) {
      return;
    }

    setLoading(true);
    try {
      const attempt = await clerk.signIn.create({
        password: values.password,
        identifier: values.credential,
      });
      if (attempt.status === "complete") {
        await clerk.setActive({ session: attempt.createdSessionId });
        router.replace("/");
      }
    } catch (e) {
      if (isClerkAPIResponseError(e)) {
        switch (e.errors[0]?.code) {
          case "form_identifier_not_found":
            helpers.setErrors({ credential: "Account not found" });
            break;
          case "form_password_incorrect":
            helpers.setErrors({
              password: "Incorrect password, please try again",
            });
            break;
          default:
            helpers.setErrors({ credential: "Unexpected error" });
        }
      }
    }
    setLoading(false);
  };

  const formik = useFormik<yup.InferType<typeof validationSchema>>({
    validationSchema,
    initialValues,
    onSubmit: handleSubmit,
  });

  return (
    <View className="flex flex-col justify-center gap-4">
      <FormikProvider value={formik}>
        <TextField label="E-mail or username" name="credential" />
        <TextField secureTextEntry label="Password" name="password" />
        <Button onPress={() => formik.handleSubmit()} loading={loading}>
          <Text>Sign in</Text>
        </Button>
      </FormikProvider>
    </View>
  );
}
