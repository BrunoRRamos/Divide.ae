import React, { Suspense } from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import type { RouterOutputs } from "~/utils/api";
import { GroupDetails } from "~/components/group/GroupDetails";
import { GroupHeader } from "~/components/group/GroupHeader";
import { GroupTabs } from "~/components/group/GroupTabs";
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
    <ScreenView className="p-0">
      <ScrollView>
        <View className="flex gap-8 px-4">
          <GroupHeader group={group} />
          <View className="flex flex-row justify-between">
            <GroupDetails group={group} />
          </View>
          <GroupTabs group={group} />
        </View>
      </ScrollView>
    </ScreenView>
  );
};

export default () => (
  <Suspense fallback={<Loading screen />}>
    <GroupPage />
  </Suspense>
);
