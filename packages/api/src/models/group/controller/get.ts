import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const getOneGroupProcedure = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.db.group.findUnique({
      where: {
        id: input.id,
        OR: [
          { users: { some: { id: ctx.auth?.user.id } } },
          { userId: ctx.auth?.user.id },
        ],
      },
      include: {
        users: true,
      },
    });
  });

export const getAllGroupsProcedure = protectedProcedure.query(
  async ({ ctx }) => {
    const groups = await ctx.db.group.findMany({
      where: {
        OR: [
          { users: { some: { id: ctx.auth?.user.id } } },
          { userId: ctx.auth?.user.id },
        ],
      },
    });

    return groups;
  },
);
