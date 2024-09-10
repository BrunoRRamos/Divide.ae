import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const deleteUser = protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    await ctx.db.user.findUniqueOrThrow({ where: { id: input } }).catch(() => {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    });
    return ctx.db.user.delete({ where: { id: input } });
  });
