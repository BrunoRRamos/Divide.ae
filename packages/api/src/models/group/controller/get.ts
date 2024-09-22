/* eslint-disable @typescript-eslint/no-floating-promises */
import { observable } from "@trpc/server/observable";
import { z } from "zod";

import type { Group } from "@/db";

import { subscriberRedis } from "../../../lib/redis";
import { protectedProcedure } from "../../../trpc";

export const getOneGroupProcedure = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.db.group.findUnique({
      where: {
        id: input.id,
        OR: [{ users: { some: { id: ctx.auth?.user.id } } }],
      },
      include: {
        users: true,
        bills: { orderBy: { createdAt: "desc" } },
      },
    });
  });

type GroupTotalValue = Group & {
  totalValue: number;
  totalPaid: number;
};

export const getOneGroupProcedureWithTotalValue = protectedProcedure
  .input(z.object({ id: z.string() }))
  .subscription(({ ctx, input }) => {
    return observable<GroupTotalValue | null>((emit) => {
      const handler = async (channel: string, message: string) => {
        try {
          const groupId = (JSON.parse(message) as G)?.id;

          const groupData = await ctx.db.group.findUnique({
            where: {
              id: groupId,
              users: { some: { id: ctx.auth?.user.id } },
            },
            include: {
              bills: true,
              users: true,
              payments: true,
            },
          });

          if (!groupData) {
            emit.next(null); // Caso o grupo não seja encontrado
            return;
          }

          const totalValue =
            groupData.bills.reduce((sum, bill) => sum + bill.value, 0) *
              (1 + (groupData.variableTax ?? 0)) +
            (groupData.fixedTax ?? 0) * groupData.users.length;

          const totalPaid = groupData.payments
            .filter((payment) => payment.accepted)
            .reduce((sum, payment) => sum + payment.value, 0);

          emit.next({
            ...groupData,
            totalValue: totalValue,
            totalPaid: totalPaid,
          });
        } catch (error) {
          console.error("Erro ao buscar dados do grupo:", error);
          emit.next(null);
        }
      };

      subscriberRedis.subscribe(`group-${input.id}`);
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      subscriberRedis.on("message", handler);

      return () => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        subscriberRedis.off("message", handler);
        subscriberRedis.unsubscribe(`group-${input.id}`);
      };
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
