import { Suspense } from "react";
import { useLocalSearchParams } from "expo-router";

import { Loading } from "~/components/layout/Loading";
import { ScreenView } from "~/components/layout/ScreenView";
import { Text } from "~/components/ui";
import { api } from "~/utils/api";

function GroupCode() {
  const params = useLocalSearchParams();

  const [group] = api.group.get.one.useSuspenseQuery({
    id: (params.id ?? "") as string,
  });

  if (!group) {
    return <ScreenView className="text-center">Group not found</ScreenView>;
  }

  return (
    <ScreenView>
      <Text className="text-center text-2xl">Group code</Text>
      <Text className="text-center text-2xl">{group.code}</Text>
    </ScreenView>
  );
}

export default () => (
  <Suspense fallback={<Loading screen />}>
    <GroupCode />
  </Suspense>
);
