import { z } from 'zod';

import { publicProcedure } from '../../../trpc';

const updateBillSchema = z.object({
    id: z.string().cuid(),
    groupId: z.string().cuid(),
    description: z.string().optional(),
    amount: z.number().optional(),
    dueAt: z.union([z.date(), z.string()]).nullable().optional(),
    paidAt: z.union([z.date(), z.string()]).nullable().optional(),
    updatedAt: z.date().default(() => new Date()),
});

export const updateBillProcedure = {
    update: publicProcedure
        .input(updateBillSchema)
        .mutation(({ ctx, input }) => {
            const { id, ...data } = input;
            return ctx.db.bill.update({ where: { id: id }, data });
        }),
};
