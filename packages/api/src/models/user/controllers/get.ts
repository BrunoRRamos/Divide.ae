import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const getUsers = protectedProcedure.query(({ ctx }) => {
  return ctx.db.user.findMany();
});

export const getUserById = protectedProcedure
  .input(
    z.object({ clerkId: z.string().optional(), id: z.string().optional() }),
  )
  .query(async ({ ctx, input }) => {
    const { id, clerkId } = input;

    if (!clerkId && !id) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const user = await ctx.db.user.findUnique({
      where: { clerkId, id },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const bills = await ctx.db.bill.findMany({
      where: { userId: user.id, paymentId: null },
    });

    const value = bills.reduce(
      (sum, bill) => sum + bill.value * bill.quantity,
      0,
    );

    return {
      ...user,
      pendingValue: value,
    };
  });
