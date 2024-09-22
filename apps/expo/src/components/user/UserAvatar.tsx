import { Text } from "react-native";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserAvatarProps {
  name: string;
  avatar?: string;
}

export function UserAvatar({ name, avatar }: UserAvatarProps) {
  return (
    <Avatar alt={name}>
      <AvatarImage source={{ uri: avatar }} />
      <AvatarFallback>
        <Text className="text-2xl uppercase text-gray-800">
          {name.charAt(0)}
        </Text>
      </AvatarFallback>
    </Avatar>
  );
}
