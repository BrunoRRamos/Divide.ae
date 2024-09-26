/* eslint-disable @typescript-eslint/no-floating-promises */
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { z } from "zod";

import type { Prisma } from "@/db";

import { subscriberRedis } from "../../../lib/redis";
import { protectedProcedure } from "../../../trpc";

type GroupGetPayload = Prisma.GroupGetPayload<{
  include: {
    bills: { include: { user: true } };
    payments: { include: { user: true; receipts: true } };
    users: true;
  };
}>;

type GroupGetPayloadWithCalculatedValues = GroupGetPayload & {
  totalValue: number;
  totalPaid: number;
};

export const groupCalculateValues = (
  group: Prisma.GroupGetPayload<{
    include: { bills: true; payments: true; users: true };
  }>,
) => {
  const totalValue =
    group.bills.reduce((sum, bill) => sum + bill.value * bill.quantity, 0) *
      (1 + (group.variableTax ?? 0)) +
    (group.fixedTax ?? 0) * group.users.length;

  const totalPaid = group.payments
    .filter((payment) => payment.accepted)
    .reduce((sum, payment) => sum + payment.value, 0);

  return { totalValue, totalPaid };
};

export const getOneGroupProcedure = protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const group = await ctx.db.group
      .findUniqueOrThrow({
        where: {
          id: input.id,
          users: { some: { id: ctx.auth?.user.id } },
        },
        include: {
          users: true,
          payments: {
            orderBy: { createdAt: "desc" },
            include: { user: true, receipts: true },
          },
          bills: { orderBy: { createdAt: "desc" }, include: { user: true } },
        },
      })
      .catch((e) => {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Group not found",
          cause: e,
        });
      });

    const data: GroupGetPayloadWithCalculatedValues = {
      ...group,
      ...groupCalculateValues(group),
    };

    return data;
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

interface MessagePayload {
  id: string;
}

export const groupSubscriptionProcedure = protectedProcedure
  .input(z.object({ id: z.string() }))
  .subscription(({ ctx, input }) => {
    return observable<GroupGetPayloadWithCalculatedValues | null>((emit) => {
      const handler = async (_: string, message: string) => {
        try {
          const groupId = (JSON.parse(message) as MessagePayload).id;

          const groupData = await ctx.db.group.findUnique({
            where: {
              id: groupId,
              users: { some: { id: ctx.auth?.user.id } },
            },
            include: {
              users: true,
              payments: {
                orderBy: { createdAt: "desc" },
                include: {
                  user: true,
                  receipts: true,
                },
              },
              bills: {
                orderBy: { createdAt: "desc" },
                include: { user: true },
              },
            },
          });

          if (!groupData) {
            emit.next(null); // Caso o grupo não seja encontrado
            return;
          }

          emit.next({
            ...groupData,
            ...groupCalculateValues(groupData),
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
