import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "../../../trpc";

export const getOneGroupProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.db.group.findUnique({
      where: { id: input.id },
    });
  });

export const getAllGroupsProcedure = publicProcedure.query(async ({ ctx }) => {
  const groupSet = await ctx.db.group.findMany();

  if (!groupSet.length) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Group not found",
    });
  }

  return groupSet;
});
