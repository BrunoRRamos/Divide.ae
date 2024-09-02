import { z } from "zod";

import { publicProcedure } from "../../../trpc";

export const createBill = publicProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      value: z.number(),
      quantity: z.number().default(1),
      recurringPeriod: z.number().optional(),
      groupId: z.string().min(1, "groupId cannot be empty"),
    }),
  )
  .mutation(({ ctx, input }) => {
    return ctx.db.bill.create({ data: input });
  });
