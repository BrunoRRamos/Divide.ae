import { useMemo, useState } from "react";
import { View } from "react-native";
import toast from "react-native-toast-message";
import { router } from "expo-router";
import { isClerkAPIResponseError, useUser } from "@clerk/clerk-expo";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";

import type { ClerkAPIResponseError } from "@clerk/shared/error";

import type { HandleSubmit } from "~/components/form/types";
import { TextField } from "~/components/form/TextField";
import { Button, Text } from "~/components/ui";

export function EditProfileForm() {
  const [loading, setLoading] = useState(false);
  const { user, isLoaded } = useUser();

  const validationSchema = yup.object().shape({
    name: yup.string().required("Nome do usuário é obrigatório"),
    currentPassword: yup.string().when("newPassword", {
      is: (newPassword: string) => newPassword[0]?.length,
      then: (schema) => schema.required("Senha atual é necessária"),
    }),
    newPassword: yup
      .string()
      .min(8, "A nova senha deve ter pelo menos 8 caracteres"),
  });

  const initialValues = useMemo(
    () => ({
      name: user?.username ?? "",
      email: user?.emailAddresses[0]?.emailAddress ?? "",
      currentPassword: "",
      newPassword: "",
    }),
    [user],
  );

  const handleSubmit: HandleSubmit<typeof validationSchema> = async (
    values,
    helpers,
  ) => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const updates: Record<string, string> = {};

      if (values.name) {
        if (values.name !== user?.username) {
          updates.username = values.name;
        }
      }

      if (values.currentPassword) {
        const currentPassword = values.currentPassword;
        const newPassword = values.newPassword ?? "";
        await user?.updatePassword({ currentPassword, newPassword });
      }

      if (Object.keys(updates).length > 0) {
        await user?.update(updates);
      }

      toast.show({
        type: "success",
        text1: "Perfil atualizado com sucesso!",
      });

      router.replace("/");
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        const e: ClerkAPIResponseError = err;

        if (e.errors.length) {
          console.log(e.errors);
          if (e.errors[0]?.code === "form_password_validation_failed") {
            helpers.setFieldError("currentPassword", "Senha atual incorreta.");
          } else if (e.errors[0]?.code === "form_password_pwned") {
            helpers.setFieldError("newPassword", "A nova senha é muito fraca.");
          } else {
            helpers.setStatus({ general: "Erro ao atualizar usuário." });
          }

          toast.show({
            type: "error",
            text1: "Erro ao atualizar usuário!",
          });
        }
      }
    } finally {
      setLoading(false);
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
      <Text className="text-xl font-bold">Atualizar Meu Perfil</Text>
      <FormikProvider value={formik}>
        <TextField label="Nome" name="name" />
        <TextField label="Email" name="email" disabled />
        <TextField secureTextEntry label="Senha atual" name="currentPassword" />
        <TextField secureTextEntry label="Nova senha" name="newPassword" />
        <Button onPress={() => formik.handleSubmit()} loading={loading}>
          <Text>Salvar Alterações</Text>
        </Button>
      </FormikProvider>
    </View>
  );
}
