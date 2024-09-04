import { groupRouter } from "./models/group/group";
import { userRouter } from "./models/user/user";
import { authRouter } from "./router/auth";
import { billRouter } from "./models/bill/bill";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  group: groupRouter,
  bill: billRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
