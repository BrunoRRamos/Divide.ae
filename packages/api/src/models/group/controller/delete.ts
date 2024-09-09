import { z } from "zod";

import { publicProcedure } from "../../../trpc";
import { TRPCError } from "@trpc/server";

export const deleteOneGroupProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(({ ctx, input }) => {
    const group = ctx.db.group.delete({ where: { id: input.id } });

    if (!group) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Group not found",
      });
    }
    return group;
  });
