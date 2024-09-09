import { z } from "zod";

import { publicProcedure } from "../../../trpc";

const createGroupSchema = z.object({
  name: z.string(),
  description: z.string(),
  fixedTax: z.number().optional(),
  variableTax: z.number().optional(),
  closedAt: z.union([z.date(), z.string()]).nullable(),
  userId: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.union([z.date(), z.string()]).optional(),
});

export const createOneGroupProcedure = publicProcedure
  .input(createGroupSchema)
  .mutation(({ ctx, input }) => {
    return ctx.db.group.create({ data: input });
  });