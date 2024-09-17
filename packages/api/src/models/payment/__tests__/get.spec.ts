import { PrismockClient } from "prismock";
import { beforeAll, expect, it, vi } from "vitest";

import { db } from "@/db";

import { createCaller, createContextInner } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

let paymentId: string;
let userId: string;
let groupId: string;

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

  userId = user.id;
  const group = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    userId: "kffjjek3345",
    closedAt: undefined,
    fixedTax: 0,
    variableTax: 0,
  });

  groupId = group.id;
  const payment1 = await caller.payment.create.one({
    value: 100,
    userId: user.id,
    groupId: group.id,
  });

  paymentId = payment1.id;
  await caller.payment.create.one({
    value: 200,
    userId: user.id,
    groupId: group.id,
  });
});

it("should get a payment", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);

  const getPayment = await caller.payment.get.one(paymentId);

  expect(getPayment).toEqual(
    expect.objectContaining({
      value: 100,
    }),
  );
});

it("should not get a payment that does not exist", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);

  const getPayment = await caller.payment.get.one("kffjjek3345");

  expect(getPayment).toEqual(null);
});

it("should get all payments from a group", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);

  const getPayments = await caller.payment.get.many.group(groupId);

  expect(getPayments).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        value: 100,
      }),
      expect.objectContaining({
        value: 200,
      }),
    ]),
  );
});

it("should get all payments from a user", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);

  const getPayments = await caller.payment.get.many.user(userId);

  expect(getPayments).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        value: 100,
      }),
    ]),
  );
});
