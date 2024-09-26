import type { PrismockClientType } from "prismock/build/main/lib/client";
import { PrismockClient } from "prismock";
import { afterAll, beforeAll, expect, it, vi } from "vitest";
import type { Context } from "../../..";

import { db } from "@/db";

import { createCaller, createContextInner } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});


let groupId: string;
let userId: string;

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

  userId = user.id;
  groupId = group.id;
  
});

afterAll(() => {
  (db as PrismockClientType).reset();
});

it("should delete a payment", async () => {
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

  const payment = await caller.payment.create.one({
    userId,
    groupId,
  });


  const deletePayment = await caller.payment.delete.one(payment.id);
  expect(deletePayment).toEqual(
    expect.objectContaining({
      id: payment.id,
      value: 100,
    }),
  );
});

it("should not delete a payment that does not exist", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);

  await expect(caller.payment.delete.one("kffjjek3345")).rejects.toThrowError();
});
