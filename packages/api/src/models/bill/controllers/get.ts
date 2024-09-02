import { z } from 'zod';

import { publicProcedure } from '../../../trpc';

export const getOneBillProcedure = {
    byId: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(({ ctx, input }) => {
            return ctx.db.bill.findFirst({
                where: { id: input.id },
            });
        }),
};

export const getAllBillsProcedure = {
    all: publicProcedure.query(({ ctx }) => {
        return ctx.db.bill.findMany();
    }),
};