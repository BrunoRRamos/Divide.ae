import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";
import { isUserOwnerOfBill } from "./utils";

export const deleteBill = protectedProcedure
  .input(z.object({ billId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    await ctx.db.bill
      .findUniqueOrThrow({ where: { id: input.billId } })
      .catch(() => {
        throw new TRPCError({ code: "NOT_FOUND", message: "Bill not found" });
      });

    if (
      !(await isUserOwnerOfBill({
        ctx,
        billId: input.billId,
        userId: ctx.auth?.user.id || "",
      }))
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User is not the owner of the bill",
      });
    }

    return ctx.db.bill.delete({ where: { id: input.billId } });
  });
