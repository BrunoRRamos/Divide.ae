import { z } from "zod";

import { publicProcedure } from "../../../trpc";

export const createUser = publicProcedure
  .input(z.object({ email: z.string().email(), name: z.string().min(2) }))
  .mutation(({ ctx, input }) => {
    return ctx.db.user.create({ data: input });
  });
