import React, { Suspense, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import type { RouterOutputs } from "~/utils/api";
import { GroupDetails } from "~/components/group/GroupDetails";
import { GroupHeader } from "~/components/group/GroupHeader";
import { GroupTabs } from "~/components/group/GroupTabs";
import { Loading } from "~/components/layout/Loading";
import { ScreenView } from "~/components/layout/ScreenView";
import { api } from "~/utils/api";
import { Button } from "~/components/ui";

export type Group = NonNullable<RouterOutputs["group"]["get"]["one"]>;

const GroupPage = () => {
  const params = useLocalSearchParams();

  const [group] = api.group.get.one.useSuspenseQuery({
    id: (params.id ?? "") as string,
  });
  
  const groupId =  (params.id ?? "") as string

  const [value, setValue] = useState(0);

  api.group.get.totalValue.useSubscription({id: groupId}, {onData: (data) => setValue(data.value)});

  const billMutarion = api.bill.create.one.useMutation();
  
  if (!group) {
    return <ScreenView className="text-center">Group not found</ScreenView>;
  }

  return (
    <ScreenView className="p-0">
      <ScrollView>
        <View className="flex gap-8 px-4">
          <GroupHeader group={group} />
          <Button onPress={() => {billMutarion.mutate(
            {name: "continha",
            description: "descricao",
            value: 10,
            quantity: 1,
            groupId: groupId
          })}}>
            <Text>
              chama na botta
            </Text>
          </Button>
          <View className="flex flex-row justify-between">
            <GroupDetails group={group} value={value} />
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
