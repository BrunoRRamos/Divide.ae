import { groupRouter } from "./models/group/group";
import { userRouter } from "./models/user/user";
import { authRouter } from "./router/auth";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  group: groupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
