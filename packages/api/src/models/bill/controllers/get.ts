import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";
import { isUserInGroup } from "./utils";

export const getBillById = protectedProcedure
  .input(z.object({ billId: z.string() }))
  .query(async ({ ctx, input }) => {
    const bill = await ctx.db.bill.findFirst({
      where: { id: input.billId },
    });

    if (!bill) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Bill not found",
      });
    }
    if (
      !(await isUserInGroup({
        ctx,
        groupId: bill.groupId,
        userId: ctx.auth?.user?.id ?? "",
      }))
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User is not the owner of the bill",
      });
    }

    return bill;
  });

export const getAllBillsByGroup = protectedProcedure
  .input(z.object({ groupId: z.string(), userId: z.string() }))
  .query(async ({ ctx, input }) => {
    const group = await ctx.db.group.findUnique({
      where: { id: input.groupId },
    });
    if (!group) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Group not found",
      });
    }

    const user = await ctx.db.user.findUnique({
      where: { id: input.userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    if (
      !(await isUserInGroup({
        ctx,
        groupId: input.groupId,
        userId: user.id,
      }))
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User is not the owner of the bill",
      });
    }

    const bills = await ctx.db.bill.findMany({
      where: { groupId: input.groupId },
    });

    if (bills.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No bills found",
      });
    }
    return bills;
  });
