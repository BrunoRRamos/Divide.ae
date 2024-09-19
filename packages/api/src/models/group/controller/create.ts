import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

const createGroupSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  fixedTax: z.number().optional(),
  variableTax: z.number().optional(),
  closedAt: z.date().optional(),
  users: z.array(z.string()).optional(),
});

export const createOneGroupProcedure = protectedProcedure
  .input(createGroupSchema)
  .mutation(async ({ ctx, input }) => {
    const { users, ...data } = input;

    const code = Math.floor(100000 + Math.random() * 900000) + "";

    const group = await ctx.db.group.create({
      data: {
        ...data,
        code,
        userId: ctx.auth?.user.id ?? "",
        users: { connect: { id: ctx.auth?.user.id } },
      },
    });

    const updatedGroup = await ctx.db.group.update({
      where: { id: group.id },
      data: { users: { connect: users?.map((userId) => ({ id: userId })) } },
      include: { users: true },
    });

    return updatedGroup;
  });
