import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

import { ScreenView } from "~/components/layout/ScreenView";
import { Button, Text } from "~/components/ui";
import { api } from "~/utils/api";
import { EditProfileForm } from "../../components/auth/update-user";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const clerk = useAuth();

  api.group.get.value.useSubscription(void 0, {
    onData: (data) => {
      console.log(data);
    },
    onStarted: () => {
      console.log("started");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutateAsync: mutate } = api.group.update.one.useMutation();

  return (
    <ScreenView className="p-10">
      <EditProfileForm />
      <Button
        variant="destructive"
        onPress={async () => {
          setLoading(true);
          await clerk.signOut();
          setLoading(false);
          router.replace("/sign-in");
        }}
        loading={loading}
      >
        <Text>Sign out</Text>
      </Button>

      {/* <Button
        onPress={async () => {
          setLoading(true);
          await mutate({
            id: "cm18gy5m200018xn3mt0060tw",
            name: "Contas do mes",
          });
          setLoading(false);
        }}
        loading={loading}
      >
        <Text>Test</Text>
      </Button> */}
    </ScreenView>
  );
}
