import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publisherRedis } from "../../../lib/redis";
import { protectedProcedure } from "../../../trpc";

const createPaymentInput = z.object({
  userId: z.string(),
  groupId: z.string(),
});

export const createPaymentProcedure = protectedProcedure
  .input(createPaymentInput)
  .mutation(async ({ input, ctx }) => {
    const groupData = await ctx.db.group.findUnique({
      where: {
        id: input.groupId,
        users: { some: { id: ctx.auth?.user.id } },
      },
      include: {
        bills: true,
      },
    });

    if (!groupData) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Group not found or you don't have access",
      });
    }

    const value =
      groupData.bills
        .filter((bills) => bills.userId)
        .reduce((sum, bill) => sum + bill.value, 0) *
        (1 + (groupData.variableTax ?? 0)) +
      (groupData.fixedTax ?? 0);

    const { userId, groupId } = input;

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

    const createdPayment = await ctx.db.payment.create({
      data: {
        value,
        accepted: true,
        user: { connect: { id: userId } },
        group: { connect: { id: groupId } },
      },
    });

    await publisherRedis.publish(
      `group-${createdPayment.groupId}`,
      JSON.stringify({ id: createdPayment.groupId }),
    );

    return createdPayment;
  });
