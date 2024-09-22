import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publisherRedis } from "../../../lib/redis";
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

    const deletedBill = await ctx.db.bill.delete({
      where: { id: input.billId },
    });

    await publisherRedis.publish(
      `group-${deletedBill.groupId}`,
      JSON.stringify({ id: deletedBill.groupId }),
    );

    return deletedBill;
  });
