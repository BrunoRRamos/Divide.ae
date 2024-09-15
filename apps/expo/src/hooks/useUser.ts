import { useAuth } from "@clerk/clerk-expo";

import { api } from "~/utils/api";

export function useUser() {
  const auth = useAuth();
  const [user] = api.user.get.one.useSuspenseQuery({ id: auth.userId ?? "" });

  return user;
}
