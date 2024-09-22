import React from "react";
import { View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";

import type { RouterOutputs } from "~/utils/api";
import { GroupDetails } from "~/components/group/GroupDetails";
import { GroupHeader } from "~/components/group/GroupHeader";
import { GroupTabs } from "~/components/group/GroupTabs";
import { ScreenView } from "~/components/layout/ScreenView";
import { withSuspenseBoundary } from "~/components/layout/withSuspenseBoundary";
import { api } from "~/utils/api";

export type Group = NonNullable<RouterOutputs["group"]["get"]["one"]>;

const GroupPage = () => {
  const params = useLocalSearchParams();

  const groupId = (params.id ?? "") as string;

  const utils = api.useUtils();

  const [group] = api.group.get.one.useSuspenseQuery({
    id: groupId,
  });

  api.group.get.subscription.useSubscription(
    { id: groupId },
    {
      onData: (data) => {
        if (data) {
          utils.group.get.one.setData({ id: groupId }, data);
        }
      },
    },
  );

  return (
    <ScreenView className="gap-8">
      <GroupHeader group={group} />
      <View className="flex flex-row justify-between">
        <GroupDetails group={group} />
      </View>
      <GroupTabs group={group} />
      <PortalHost />
    </ScreenView>
  );
};

export default withSuspenseBoundary(gestureHandlerRootHOC(GroupPage));
