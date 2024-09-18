import { Suspense } from "react";
import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

import type { RouterOutputs } from "~/utils/api";
import { GroupHeader } from "~/components/group/GroupHeader";
import { GroupMembers } from "~/components/group/GroupMembers";
import { Loading } from "~/components/layout/Loading";
import { ScreenView } from "~/components/layout/ScreenView";
import { api } from "~/utils/api";

export type Group = NonNullable<RouterOutputs["group"]["get"]["one"]>;

const GroupPage = () => {
  const params = useLocalSearchParams();

  const [group] = api.group.get.one.useSuspenseQuery({
    id: (params.id ?? "") as string,
  });

  if (!group) {
    return null;
  }

  return (
    <ScreenView>
      <GroupHeader group={group} />
      <GroupMembers group={group} />
      <Text>{JSON.stringify(group, null, 2)}</Text>
    </ScreenView>
  );
};

export default () => (
  <Suspense fallback={<Loading screen />}>
    <GroupPage />
  </Suspense>
);
