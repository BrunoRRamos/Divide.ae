import { z } from 'zod';

import { publicProcedure } from '../../../trpc';

export const deleteBill = publicProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
        return ctx.db.bill.delete({ where: { id: input } });
    });