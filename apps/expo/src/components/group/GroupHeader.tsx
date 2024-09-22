import { TouchableOpacity, View } from "react-native";
import { Settings } from "lucide-react-native";

import type { Group } from "~/app/group/[id]";
import { Text } from "../ui";

interface GroupHeaderProps {
  group: Group;
}

export function GroupHeader({ group }: GroupHeaderProps) {
  return (
    <View className="flex flex-row items-center justify-between">
      <Text className="text-2xl">{group.name}</Text>
      <TouchableOpacity>
        <Settings size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
