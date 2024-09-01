import { z } from "zod";

import { protectedProcedure } from "../../../trpc";

const updateGroupSchema = z.object({
  id: z.string().cuid(),
  name: z.string().optional(),
  description: z.string().optional(),
  fixedTax: z.number().optional(),
  variableTax: z.number().optional(),
  closedAt: z.union([z.date(), z.string()]).nullable().optional(),
  updatedAt: z.date().default(() => new Date()),
});

export const updateOneGroupProcedure = {
  update: protectedProcedure
    .input(updateGroupSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.group.update({ where: { id: id }, data });
    }),
};
