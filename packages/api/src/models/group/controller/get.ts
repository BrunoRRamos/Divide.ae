import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { publicProcedure } from "../../../trpc";

export const getOneGroupProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx, input }) => {
    const group = ctx.db.group.findUnique({
      where: { id: input.id },
    });

    if (!group) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Group not found",
      });
    }
    return group;
  });

export const getAllGroupsProcedure = publicProcedure.query(({ ctx }) => {
  const groupSet = ctx.db.group.findMany();

  if (!groupSet) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Group not found",
    });
  }

  return groupSet;
});
