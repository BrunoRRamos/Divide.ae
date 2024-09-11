import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const deletePaymentProcedure = protectedProcedure
  .input(z.string())
  .mutation(async ({ input, ctx }) => {
    await ctx.db.payment
      .findUniqueOrThrow({
        where: { id: input },
      })
      .catch(() => {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment not found",
        });
      });

    return ctx.db.payment.delete({
      where: { id: input },
    });
  });
