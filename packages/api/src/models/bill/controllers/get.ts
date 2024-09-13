import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const getBillById = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.db.bill.findFirst({
      where: { id: input.id },
    });
  });

export const getAllBillsByGroup = protectedProcedure
  .input(z.object({ groupId: z.string() }))
  .query(async ({ ctx, input }) => {
    const groupExists = await ctx.db.group.findFirst({
      where: { name: input.groupId },
    });

    if (groupExists === null) {
      console.log(groupExists);
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Grupo não encontrado.",
      });
    }

    const bills = await ctx.db.bill.findMany({
      where: { groupId: input.groupId },
    });

    return bills;
  });
