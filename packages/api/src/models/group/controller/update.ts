import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

const updateGroupSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  fixedTax: z.number().optional(),
  variableTax: z.number().optional(),
  closedAt: z.union([z.date(), z.string()]).nullable().optional(),
  updatedAt: z.date().default(() => new Date()),
});

export const updateOneGroupProcedure = protectedProcedure
  .input(updateGroupSchema)
  .mutation(({ ctx, input }) => {
    const { id, ...data } = input;
    return ctx.db.group.update({ where: { id: id }, data });
  });

export const connectUserToGroupProcedure = protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    const code = input;

    const group = await ctx.db.group.findUnique({ where: { code } });

    if (!group) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Group not found",
      });
    }

    const updatedGroup = await ctx.db.group.update({
      where: { code: code },
      data: { users: { connect: { id: ctx.auth?.user.id } } },
    });

    return updatedGroup;
  });
