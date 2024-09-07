import { z } from "zod";

import { publicProcedure } from "../../../trpc";

export const getOneGroupProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.db.group.findFirst({
      where: { id: input.id },
    });
  });

export const getAllGroupsProcedure = publicProcedure.query(({ ctx }) => {
  return ctx.db.group.findMany();
});
