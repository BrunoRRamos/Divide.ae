import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publisherRedis } from "../../../lib/redis";
import { protectedProcedure } from "../../../trpc";

const createPaymentInput = z.object({
  groupId: z.string(),
});

export const createPaymentProcedure = protectedProcedure
  .input(createPaymentInput)
  .mutation(async ({ input, ctx }) => {
    const group = await ctx.db.group.findUnique({
      where: {
        id: input.groupId,
        users: { some: { id: ctx.auth?.user.id } },
      },
      include: {
        bills: true,
        users: true,
      },
    });

    if (!group) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Group not found or you don't have access",
      });
    }

    const bills = await ctx.db.bill.findMany({
      where: {
        userId: ctx.auth?.user.id,
        groupId: input.groupId,
      },
    });

    const value =
      bills.reduce((sum, bill) => sum + bill.value * bill.quantity, 0) *
        (1 + (group.variableTax ?? 0)) +
      (group.fixedTax ?? 0) * group.users.length;

    const createdPayment = await ctx.db.payment.create({
      data: {
        value,
        accepted: true,
        user: { connect: { id: ctx.auth?.user.id } },
        group: { connect: { id: group.id } },
      },
    });

    await publisherRedis.publish(
      `group-${createdPayment.groupId}`,
      JSON.stringify({ id: createdPayment.groupId }),
    );

    return createdPayment;
  });
