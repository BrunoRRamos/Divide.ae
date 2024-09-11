import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const deleteBill = protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    await ctx.db.bill.findUniqueOrThrow({ where: { id: input } }).catch(() => {
      throw new TRPCError({ code: "NOT_FOUND", message: "Bill not found" });
    });
    return ctx.db.bill.delete({ where: { id: input } });
  });
