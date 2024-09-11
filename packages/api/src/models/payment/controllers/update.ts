import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const updatePaymentProcedure = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      value: z.number().min(0.01).optional(),
      accepted: z.boolean().optional(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { id, ...data } = input;

    await ctx.db.payment
      .findUniqueOrThrow({
        where: { id },
      })
      .catch(() => {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment not found",
        });
      });

    return await ctx.db.payment.update({
      where: { id: input.id },
      data: {
        ...data,
      },
    });
  });
