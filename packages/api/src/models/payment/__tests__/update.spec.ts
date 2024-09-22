import type { PrismockClientType } from "prismock/build/main/lib/client";
import { PrismockClient } from "prismock";
import { afterAll, beforeAll, expect, it, vi } from "vitest";

import { db } from "@/db";

import { createCaller, createContextInner } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

let paymentId: string;

beforeAll(async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);

  const user = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
  });

  const group = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    closedAt: undefined,
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
  const ctx = await createContextInner({});
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
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);

  await expect(
    caller.payment.update.one({
      id: paymentId,
      value: -100,
    }),
  ).rejects.toThrowError();
});
