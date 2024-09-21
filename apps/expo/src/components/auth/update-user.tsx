import { useMemo, useState } from "react";
import { ToastAndroid, View } from "react-native";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { FormikProvider, useFormik } from "formik";
import * as yup from "yup";

import { TextField } from "~/components/form/TextField";
import { HandleSubmit } from "~/components/form/types";
import { Button, Text } from "~/components/ui";

export function EditProfileForm() {
  const [loading, setLoading] = useState(false);
  const { user, isLoaded } = useUser();

  const validationSchema = yup.object().shape({
    name: yup.string().required("Nome do usuário é obrigatório"),
    currentPassword: yup.string().when("newPassword", (newPassword, schema) => {
      return newPassword[0]?.length
        ? schema.required("Senha atual é necessária")
        : schema;
    }),
    newPassword: yup
      .string()
      .min(8, "A nova senha deve ter pelo menos 8 caracteres"),
  });

  const initialValues = useMemo(
    () => ({
      name: user?.username || "",
      email: user?.emailAddresses[0]?.emailAddress || "",
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
      const updates: any = {};

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

      ToastAndroid.showWithGravity(
        "Perfil atualizado com sucesso!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );

      router.replace("/");
    } catch (e: any) {
      if (e.errors) {
        console.log(e.errors);
        if (e.errors[0]?.code === "form_password_validation_failed") {
          helpers.setFieldError("currentPassword", "Senha atual incorreta.");
        } else if (e.errors[0]?.code === "form_password_pwned") {
          helpers.setFieldError("newPassword", "A nova senha é muito fraca.");
        } else {
          helpers.setStatus({ general: "Erro ao atualizar usuário." });
        }
        ToastAndroid.showWithGravity(
          "Erro ao atualizar usuário!",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
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
