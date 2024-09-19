import { Suspense } from "react";
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
    return <ScreenView className="text-center">Group not found</ScreenView>;
  }

  return (
    <ScreenView>
      <GroupHeader group={group} />
      <GroupMembers group={group} />
    </ScreenView>
  );
};

export default () => (
  <Suspense fallback={<Loading screen />}>
    <GroupPage />
  </Suspense>
);