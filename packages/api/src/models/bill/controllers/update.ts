import { z } from "zod";

import { publicProcedure } from "../../../trpc";

const updateBillSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  description: z.string().optional(),
  amount: z.number().optional(),
  dueAt: z.union([z.date(), z.string()]).nullable().optional(),
  paidAt: z.union([z.date(), z.string()]).nullable().optional(),
  updatedAt: z.date().default(() => new Date()),
});

export const updateBill = publicProcedure
  .input(updateBillSchema)
  .mutation(async ({ ctx, input }) => {
    const { id, ...data } = input;
    const existingBill = await ctx.db.bill.findUnique({ where: { id } });
    if (!existingBill) {
      throw new Error("Bill not found");
    }
    return ctx.db.bill.update({ where: { id: id }, data });
  });
