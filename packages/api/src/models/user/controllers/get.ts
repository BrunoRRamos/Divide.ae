import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const getUsers = protectedProcedure.query(({ ctx }) => {
  return ctx.db.user.findMany();
});

export const getUserById = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.db.user.findUnique({
      where: { id: input.id },
    });
  });
