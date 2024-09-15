import { groupRouter } from "./models/group/group";
import { paymentRouter } from "./models/payment/router";
import { userRouter } from "./models/user/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  group: groupRouter,
  payment: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
