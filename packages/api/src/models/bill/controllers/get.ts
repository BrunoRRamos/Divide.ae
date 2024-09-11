import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const getBillById = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.db.bill.findFirst({
      where: { id: input.id },
    });
  });

export const getAllBills = protectedProcedure.query(({ ctx }) => {
  return ctx.db.bill.findMany();
});
