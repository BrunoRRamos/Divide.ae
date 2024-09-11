import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

const createPaymentInput = z.object({
  value: z.number().min(0.01),
  userId: z.string(),
  groupId: z.string(),
});

export const createPaymentProcedure = protectedProcedure
  .input(createPaymentInput)
  .mutation(async ({ input, ctx }) => {
    const { userId, groupId, value } = input;
    await ctx.db.user
      .findUniqueOrThrow({
        where: { id: userId },
      })
      .catch(() => {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      });

    await ctx.db.group
      .findUniqueOrThrow({
        where: { id: groupId },
      })
      .catch(() => {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Group not found",
        });
      });

    return ctx.db.payment.create({
      data: {
        value,
        user: { connect: { id: userId } },
        group: { connect: { id: groupId } },
      },
    });
  });
