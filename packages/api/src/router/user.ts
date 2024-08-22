import { z } from "zod";

import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: { id: input.id },
      });
    }),

  create: protectedProcedure
    .input(z.object({ email: z.string(), name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.user.create({ data: input });
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.user.delete({ where: { id: input } });
  }),
} satisfies TRPCRouterRecord;
