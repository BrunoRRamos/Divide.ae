import { billRouter } from "./models/bill/router";
import { groupRouter } from "./models/group/group";
import { paymentRouter } from "./models/payment/router";
import { userRouter } from "./models/user/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  group: groupRouter,
  bill: billRouter,
  payment: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
