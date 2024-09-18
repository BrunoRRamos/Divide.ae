import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserAvatarProps {
  name: string;
  avatar?: string;
}

export function UserAvatar({ name, avatar }: UserAvatarProps) {
  return (
    <Avatar alt={name}>
      <AvatarImage source={{ uri: avatar }} />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
}
