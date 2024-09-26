import type { PrismockClientType } from "prismock/build/main/lib/client";
import { PrismockClient } from "prismock";
import { afterAll, beforeAll, expect, it, vi } from "vitest";
import type { Context } from "../../..";

import { db } from "@/db";

import { createCaller, createContextInner } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

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

});

afterAll(() => {
  (db as PrismockClientType).reset();
});

it("should create a payment", async () => {
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
      userId,
      groupId,
    }),
  );
});


it("should not create a payment with empty userId", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);

  await expect(
    caller.payment.create.one({
      groupId,
      userId: "",
    }),
  ).rejects.toThrowError();
});

it("should not create a payment with empty groupId", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);

  await expect(
    caller.payment.create.one({
      userId,
      groupId: "",
    }),
  ).rejects.toThrowError();
});
