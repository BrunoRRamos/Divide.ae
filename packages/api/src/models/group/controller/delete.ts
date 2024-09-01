import { z } from "zod";

import { publicProcedure } from "../../../trpc";

export const deleteOneGroupProcedure = {
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.group.delete({ where: { id: input.id } });
    }),
};
