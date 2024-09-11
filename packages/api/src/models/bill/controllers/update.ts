import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

// Define the input schema for the updateBill mutation
const updateBillInput = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  value: z.number(),
  quantity: z.number().optional(),
  recurringPeriod: z.number().optional(), // Days
  groupId: z.string(),
});

export const updateBill = protectedProcedure
  .input(updateBillInput)
  .mutation(async ({ ctx, input }) => {
    await ctx.db.bill
      .findUniqueOrThrow({ where: { id: input.id } })
      .catch(() => {
        throw new TRPCError({ code: "NOT_FOUND", message: "Bill not found" });
      });

    return ctx.db.bill.update({
      where: { id: input.id },
      data: {
        name: input.name,
        description: input.description,
        value: input.value,
        quantity: input.quantity,
        recurringPeriod: input.recurringPeriod,
        groupId: input.groupId,
      },
    });
  });
