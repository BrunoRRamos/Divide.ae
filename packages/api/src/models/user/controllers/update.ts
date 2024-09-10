import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const updateUser = protectedProcedure
  .input(z.object({ id: z.string(), name: z.string() }))
  .mutation(async ({ ctx, input }) => {
    await ctx.db.user
      .findUniqueOrThrow({ where: { id: input.id } })
      .catch(() => {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      });
    return ctx.db.user.update({
      where: { id: input.id },
      data: { name: input.name },
    });
  });
