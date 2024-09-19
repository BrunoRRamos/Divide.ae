import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";

import { ScreenView } from "~/components/layout/ScreenView";
import { Button, Text } from "~/components/ui";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const clerk = useAuth();

  return (
    <ScreenView className="p-10">
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
