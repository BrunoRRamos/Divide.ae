import { useMemo, useState } from "react";
import { View } from "react-native";
import { isClerkAPIResponseError, useSignUp } from "@clerk/clerk-expo";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";

import type { HandleSubmit } from "../form/types";
import { Button, Text } from "~/components/ui";
import { TextField } from "../form/TextField";
import { SignUpVerify } from "./SignUpVerify";

export function SignUpForm() {
  const clerk = useSignUp();

  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object().shape({
    username: yup.string().required("Please enter your credentials"),
    email: yup
      .string()
      .required("Please enter your credentials")
      .email("Please enter a valid e-mail address"),
    password: yup
      .string()
      .min(8, "Password too short, password must be 8 characters or more")
      .required("Please enter your password"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), undefined], "Passwords must match"),
  });

  const initialValues = useMemo<yup.InferType<typeof validationSchema>>(
    () => ({ email: "", username: "", password: "", confirmPassword: "" }),
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
      await clerk.signUp.create({
        username: values.username,
        password: values.password,
        emailAddress: values.email,
      });
      await clerk.signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setPendingVerification(true);
    } catch (e) {
      console.log(e.toString());

      if (isClerkAPIResponseError(e)) {
        switch (e.errors[0]?.code) {
          case "form_identifier_exists":
            helpers.setErrors(
              e.errors[0]?.message.includes("user")
                ? { username: "Username already taken" }
                : { email: "Email already taken" },
            );
            break;
        }
      }
    }
    setLoading(false);
  };

  const form = useFormik<yup.InferType<typeof validationSchema>>({
    validationSchema,
    initialValues,
    onSubmit: handleSubmit,
  });

  return (
    <View className="flex flex-col justify-center gap-4">
      {pendingVerification ? (
        <SignUpVerify />
      ) : (
        <FormikProvider value={form}>
          <TextField label="Username" name="username" />
          <TextField label="E-mail" name="email" />
          <TextField secureTextEntry label="Password" name="password" />
          <TextField
            secureTextEntry
            label="Confirm password"
            name="confirmPassword"
          />
          <Button
            loading={loading}
            onPress={() => {
              form.handleSubmit();
            }}
          >
            <Text>Sign in</Text>
          </Button>
        </FormikProvider>
      )}
    </View>
  );
}
