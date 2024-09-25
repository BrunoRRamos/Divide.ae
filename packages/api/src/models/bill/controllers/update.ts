import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publisherRedis } from "../../../lib/redis";
import { protectedProcedure } from "../../../trpc";
import { isUserOwnerOfBill } from "./utils";

export const updateBill = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      value: z.number().optional(),
      quantity: z.number().optional(),
      recurringPeriod: z.number().optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const bill = await ctx.db.bill
      .findUniqueOrThrow({ where: { id: input.id } })
      .catch(() => {
        throw new TRPCError({ code: "NOT_FOUND", message: "Bill not found" });
      });
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.auth?.user.id },
    });
    if (!user) {
      throw new Error("User not found");
    }

    if (
      !(await isUserOwnerOfBill({
        ctx,
        billId: bill.id,
        userId: user.id,
      }))
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User is not the owner of the bill",
      });
    }

    const updatedBill = await ctx.db.bill.update({
      where: { id: input.id },
      data: {
        name: input.name,
        description: input.description,
        value: input.value,
        quantity: input.quantity,
        recurringPeriod: input.recurringPeriod,
      },
    });

    await publisherRedis.publish(
      `group-${updatedBill.groupId}`,
      JSON.stringify({ id: updatedBill.groupId }),
    );

    return updatedBill;
  });
