import { View } from "react-native";

import type { Group } from "~/app/group/[id]";
import { UserAvatar } from "../user/UserAvatar";

interface GroupMembersProps {
  group: Group;
}

export function GroupMembers({ group }: GroupMembersProps) {
  return (
    <View>
      {group.users.map((user) => (
        <UserAvatar key={user.id} name={user.name} />
      ))}
    </View>
  );
}
