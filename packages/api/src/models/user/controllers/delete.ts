import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const deleteUser = protectedProcedure
  .input(z.string())
  .mutation(({ ctx, input }) => {
    return ctx.db.user.delete({ where: { id: input } });
  });
