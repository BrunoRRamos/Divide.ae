import type { TRPCRouterRecord } from "@trpc/server";

// import { invalidateSessionToken } from "@/auth";

// import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  // getSession: publicProcedure.query(({ ctx }) => {
  //   return ctx.session;
  // }),
  // signOut: protectedProcedure.mutation(async (opts) => {
  //   if (!opts.ctx.token) {
  //     return { success: false };
  //   }
  //   await invalidateSessionToken(opts.ctx.token);
  //   return { success: true };
  // }),
} satisfies TRPCRouterRecord;
