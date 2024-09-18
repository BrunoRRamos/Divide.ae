import { TouchableOpacity, View } from "react-native";
import { Settings } from "lucide-react-native";

import type { Group } from "~/app/group/[id]";
import { Text } from "../ui";

interface GroupHeaderProps {
  group: Group;
}

export function GroupHeader({ group }: GroupHeaderProps) {
  return (
    <View className="flex flex-row justify-between">
      <Text className="text-3xl font-medium">{group.name}</Text>
      <TouchableOpacity>
        <Settings size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
}
