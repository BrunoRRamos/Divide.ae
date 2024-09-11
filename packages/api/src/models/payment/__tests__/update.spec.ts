import type { PrismockClientType } from "prismock/build/main/lib/client";
import { PrismockClient } from "prismock";
import { afterAll, beforeAll, expect, it, vi } from "vitest";

import { db } from "@/db";

import { createCaller } from "../../..";
import { createTRPCContext } from "../../../trpc";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

let paymentId: string;

beforeAll(async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const user = await caller.user.create.one({
    name: "Pedro",
    email: "pedro@gmail.com",
  });
  const group = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    userId: "kffjjek3345",
    closedAt: null,
    fixedTax: 0,
    variableTax: 0,
  });

  const payment = await caller.payment.create.one({
    value: 100,
    userId: user.id,
    groupId: group.id,
  });
  paymentId = payment.id;
});

afterAll(() => {
  (db as PrismockClientType).reset();
});

it("should update a payment", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  const updatePayment = await caller.payment.update.one({
    id: paymentId,
    value: 200,
  });

  expect(updatePayment).toEqual(
    expect.objectContaining({
      value: 200,
    }),
  );
});

it("should not update a payment with negative value", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  await expect(
    caller.payment.update.one({
      id: paymentId,
      value: -100,
    }),
  ).rejects.toThrowError();
});
