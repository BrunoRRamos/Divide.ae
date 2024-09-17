import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "../../../trpc";
import { isUserInGroup } from "./utils";

export const createBill = publicProcedure
  .input(
    z.object({
      name: z.string().min(1, "name cannot be empty"),
      description: z.string().optional(),
      value: z.number(),
      quantity: z.number().default(1),
      recurringPeriod: z.number().optional(),
      groupId: z.string().min(1, "groupId cannot be empty"),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const group = await ctx.db.group.findUnique({
      where: { id: input.groupId },
    });

    if (!group) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Group not found",
      });
    }

    const authorized = await isUserInGroup({
      userId: ctx.auth?.user?.id ?? "",
      groupId: input.groupId,
      ctx,
    });

    if (!authorized) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User not authorized to perform this action",
      });
    }

    return ctx.db.bill.create({
      data: { ...input, userId: ctx.auth?.user?.id ?? "" },
    });
  });
