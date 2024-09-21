/* eslint-disable @typescript-eslint/no-floating-promises */
import { observable } from "@trpc/server/observable";
import { z } from "zod";

import { subscriberRedis } from "../../../lib/redis";
import { protectedProcedure } from "../../../trpc";

export const getOneGroupProcedure = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.db.group.findUnique({
      where: {
        id: input.id,
        OR: [
          { users: { some: { id: ctx.auth?.user.id } } },
          { userId: ctx.auth?.user.id },
        ],
      },
      include: {
        users: true,
        bills: { orderBy: { createdAt: "desc" } },
      },
    });
  });

export const getAllGroupsProcedure = protectedProcedure.query(
  async ({ ctx }) => {
    const groups = await ctx.db.group.findMany({
      where: {
        OR: [
          { users: { some: { id: ctx.auth?.user.id } } },
          { userId: ctx.auth?.user.id },
        ],
      },
    });

    return groups;
  },
);

type G = {
  id: string;
  value: number;
} | null;

export const getTotalValueFromGroupProcedure = protectedProcedure.subscription(
  ({ ctx }) => {
    return observable<G>((emit) => {
      const handler = (channel: string, message: string) => {
        const dataId = (JSON.parse(message) as G)?.id;
        ctx.db.group
          .findUnique({
            where: { id: dataId },
            include: { bills: true },
          })
          .then((data) => {
            if (!data) {
              emit.next(null);
              return;
            }

            const values = data.bills.map((bill) => bill.value);

            emit.next({
              id: data.id,
              value: values.reduce((a, b) => a + b, 0),
            });
          })
          .catch(() => {
            emit.next(null);
          });

        emit.next(null);
      };

      subscriberRedis.subscribe("group-up");
      subscriberRedis.on("message", handler);

      return () => {
        subscriberRedis.off("message", handler);
        subscriberRedis.unsubscribe("group-up");
      };
    });
  },
);
