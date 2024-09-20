import { useAuth } from "@clerk/clerk-expo";
import { useState } from "react";

import { EditProfileForm } from "~/components/auth/editUser";
import { ScreenView } from "~/components/layout/ScreenView";
import { Button, Text } from "~/components/ui";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const clerk = useAuth();

  return (
    <ScreenView className="p-10">
      <EditProfileForm/>
      <Button
        variant="destructive"
        onPress={async () => {
          setLoading(true);
          await clerk.signOut();
          setLoading(false);
        }}
        loading={loading}
      >
        <Text>Sign out</Text>
      </Button>
      
    </ScreenView>
  );
}
