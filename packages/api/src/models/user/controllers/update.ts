import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const updateUser = protectedProcedure
  .input(z.object({ id: z.string(), name: z.string() }))
  .mutation(({ ctx, input }) => {
    return ctx.db.user.update({
      where: { id: input.id },
      data: { name: input.name },
    });
  });
