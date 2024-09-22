import { TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { Plus } from "lucide-react-native";

import type { Group } from "~/app/group/[id]";
import { UserAvatar } from "../user/UserAvatar";

interface GroupMembersProps {
  group: Group;
}

export function GroupMembers({ group }: GroupMembersProps) {
  return (
    <View className="flex flex-row">
      {group.users.slice(0, 3).map((user, i) => (
        <View
          style={{ left: i * -20 }}
          className="rounded-full border-2 border-white"
        >
          <UserAvatar key={user.id} name={user.name} />
        </View>
      ))}
      <Link
        href={{ pathname: "/group/[id]/code", params: { id: group.id } }}
        asChild
      >
        <TouchableOpacity>
          <Plus size={24} color="black" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
