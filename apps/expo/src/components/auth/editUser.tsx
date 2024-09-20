import { isClerkAPIResponseError, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { FormikProvider, useFormik } from "formik";

import * as yup from "yup";

import { clerkClient } from "@/api/src/lib/clerk";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { TextField } from "../form/TextField";
import { HandleSubmit } from "../form/types";
import { Button, Text } from "../ui";

export function EditProfileForm() {
  const [loading, setLoading] = useState(false);
  const { user, isLoaded } = useUser();

  const validationSchema = yup.object().shape({
    name: yup.string(),
    email: yup.string().email("Invalid email"),
    password: yup.string().min(8, "Password must be at least 8 characters"),
    currentPassword: yup.string().required("Current password is required"),
    newPassword: yup.string().min(8, "New password must be at least 8 characters")
  });
 
  const initialValues = useMemo(
    () => ({
      name: user?.username || "", 
      email: user?.emailAddresses[0]?.emailAddress || "",
      currentPassword: "",
      newPassword: "",
    }),
    [user]
  );

  const handleSubmit: HandleSubmit<typeof validationSchema> = async (
    values,
    helpers
  ) => {
    if (!isLoaded) {
      return;
    }
    
    setLoading(true);
   
    try {
      const updates: any = {};

      if (values.name) {
        if (values.name !== user?.username) {
          updates.username = values.name;
        }
      }

      if (values.email) {
        const currentEmail = user?.emailAddresses[0]?.emailAddress;
  
        if (values.email !== currentEmail) {
          const existingEmail = user?.emailAddresses?.find(
            (emailObj) => emailObj.emailAddress === values.email
          );
  
          if (!existingEmail) {
            const emailAddressId = user?.primaryEmailAddress?.id;
  
            if (emailAddressId) {
              const params = {
                emailAddress: values.email,
                primary: true,
                verified: true,
              };
  
              await clerkClient.emailAddresses.updateEmailAddress(emailAddressId, params);
            }
          }
        }
      }
      
      if (values.password) {
         const  currentPassword= values.password;
         const  newPassword= values.newPassword ?? "";
        await user?.updatePassword({currentPassword, newPassword});
      }

      if (Object.keys(updates).length > 0) {
        await user?.update(updates);
      }

      router.replace("/");
    } catch (e) {
      if (isClerkAPIResponseError(e)) {
        helpers.setErrors({ email: "Error updating profile" });
      }
    } 
  };

  const formik = useFormik<yup.InferType<typeof validationSchema>>({
    validationSchema,
    initialValues,
    enableReinitialize: true,
    onSubmit: handleSubmit,
  });

  return (
    <View className="flex flex-col justify-center gap-4">
      <FormikProvider value={formik}>
        <TextField label="Nome" name="name" />
        <TextField label="Email" name="email" />
        <TextField secureTextEntry label="Senha" name="password" />
        <Button onPress={() => formik.handleSubmit()} loading={loading}>
          <Text>Save Changes</Text>
        </Button>
      </FormikProvider>
    </View>
  );
}
