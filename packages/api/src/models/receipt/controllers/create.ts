import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const createReceiptProcedure = protectedProcedure
  .input(
    z.object({
      paymentId: z.string(),
      fileName: z.string(),
      uri: z.string(),
      ext: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { paymentId, ...data } = input;

    const payment = await ctx.db.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Payment not found",
      });
    }

    return ctx.db.receipt.create({
      data: {
        paymentId,
        ...data,
      },
    });
  });
