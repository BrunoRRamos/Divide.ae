import { authRouter } from "./router/auth";
import { groupRouter } from "./router/group";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  group: groupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
