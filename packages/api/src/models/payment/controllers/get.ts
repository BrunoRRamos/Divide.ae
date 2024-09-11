import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

export const getPaymentProcedure = protectedProcedure
  .input(z.string())
  .query(async ({ input, ctx }) => {
    return ctx.db.payment.findUnique({
      where: { id: input },
    });
  });

export const getPaymentsFromGroupProcedure = protectedProcedure
  .input(z.string())
  .query(async ({ input, ctx }) => {
    return ctx.db.payment.findMany({
      where: { groupId: input },
    });
  });

export const getPaymentsFromUserProcedure = protectedProcedure
  .input(z.string())
  .query(async ({ input, ctx }) => {
    return ctx.db.payment.findMany({
      where: { userId: input },
    });
  });
