import { z } from "zod";
import { desc, eq } from "@/db-drizzle";
import { CreateUserSchema, User } from "@/db-drizzle/schema";
import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.User.findMany({
      orderBy: desc(User.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.User.findFirst({
        where: eq(User.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(CreateUserSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(User).values(input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(User).where(eq(User.id, input));
  }),
} satisfies TRPCRouterRecord;
