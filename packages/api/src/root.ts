import { groupRouter } from "./models/group/group";
import { paymentRouter } from "./models/payment/router";
import { userRouter } from "./models/user/user";
import { authRouter } from "./router/auth";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  group: groupRouter,
  payment: paymentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
