import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const getUsers = protectedProcedure.query(({ ctx }) => {
  return ctx.db.user.findMany();
});

export const getUserById = protectedProcedure
  .input(
    z.object({ clerkId: z.string().optional(), id: z.string().optional() }),
  )
  .query(({ ctx, input }) => {
    const { id, clerkId } = input;

    if (!clerkId && !id) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    return ctx.db.user.findUnique({
      where: { clerkId, id },
    });
  });
