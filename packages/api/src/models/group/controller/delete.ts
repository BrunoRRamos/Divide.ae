import { z } from "zod";

import { publicProcedure } from "../../../trpc";

export const deleteOneGroupProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.group.delete({ where: { id: input.id } });
  });
