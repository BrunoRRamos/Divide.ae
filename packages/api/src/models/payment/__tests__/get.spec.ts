import { PrismockClient } from "prismock";
import { beforeAll, expect, it, vi } from "vitest";
import type { Context } from "../../..";

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
    closedAt: undefined,
    fixedTax: 0,
    variableTax: 0,
  });

  groupId = group.id;
  
  const payment1 = await caller.payment.create.one({
    userId: user.id,
    groupId: group.id,
  });

  paymentId = payment1.id;
  await caller.payment.create.one({
    userId: user.id,
    groupId: group.id,
  });
});

it("should get a payment", async () => {
  const user = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
  });

  const caller = createCaller({ db, auth: { user } } as Context);

  await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    fixedTax: 0,
  });

  await caller.bill.create.one({
      name: "salgado",
      value: 50,
      groupId,
    });

  await caller.bill.create.one({
      name: "refrigerante",
      value: 50,
      groupId,
    });

  const createPayment = await caller.payment.create.one({
    userId,
    groupId,
  });

  expect(createPayment).toEqual(
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
 const user = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
  });

  const caller = createCaller({ db, auth: { user } } as Context);

  await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    fixedTax: 0,
  });

  await caller.bill.create.one({
      name: "salgado",
      value: 50,
      groupId,
    });

  await caller.bill.create.one({
      name: "refrigerante",
      value: 50,
      groupId,
    });

 await caller.payment.create.one({
    userId,
    groupId,
  });

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
