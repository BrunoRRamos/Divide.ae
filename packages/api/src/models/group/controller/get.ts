import { z } from "zod";

import { publicProcedure } from "../../../trpc";

export const getOneGroupProcedure = {
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.group.findFirst({
        where: { id: input.id },
      });
    }),
};

export const getAllGroupsProcedure = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.group.findMany();
  }),
};
