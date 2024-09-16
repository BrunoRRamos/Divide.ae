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
    userId: "kffjjek3345",
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

it("should delete a payment", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);

  const deletePayment = await caller.payment.delete.one(paymentId);

  expect(deletePayment).toEqual(
    expect.objectContaining({
      id: paymentId,
      value: 100,
    }),
  );
});

it("should not delete a payment that does not exist", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);

  await expect(caller.payment.delete.one("kffjjek3345")).rejects.toThrowError();
});
