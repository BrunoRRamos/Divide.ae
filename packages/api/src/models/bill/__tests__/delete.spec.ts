import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { db } from "@/db";

import type { Context } from "../../..";
import { createCaller, createContextInner } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("should delete a bill", async () => {
  const user = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
  });

  const caller = createCaller({ db, auth: { user } } as Context);

  const group = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    fixedTax: 0,
  });

  const bill = await caller.bill.create.one({
    name: "Electricity",
    description: "Monthly electricity bill",
    value: 150.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: group.id,
  });

  const deleteBill = await caller.bill.delete.one({
    billId: bill.id,
    userId: user.id,
  });
  expect(deleteBill).toEqual(expect.objectContaining({ id: bill.id }));

  await expect(
    caller.bill.get.one({
      billId: bill.id,
    }),
  ).rejects.toThrowError("Bill not found");
});

it("should not delete a bill that does not exist", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);

  const user = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
  });

  await expect(() =>
    caller.bill.delete.one({ billId: "no existing id", userId: user.id }),
  ).rejects.toThrowError("Bill not found");
});

it("should not delete another user's bill", async () => {
  const user = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
  });

  const caller = createCaller({ db, auth: { user } } as Context);

  const group1 = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    fixedTax: 0,
  });

  const bill1 = await caller.bill.create.one({
    name: "Electricity",
    description: "Monthly electricity bill",
    value: 150.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: group1.id,
  });

  const user2 = await db.user.create({
    data: {
      clerkId: "",
      name: "Joao",
      email: "joao@gmail.com",
    },
  });

  const group2 = await caller.group.create.one({
    name: "Aniversario de Joao",
    description: "Comprar torta, salgados e refrigerante",
    fixedTax: 0,
  });

  await caller.bill.create.one({
    name: "Water",
    description: "Monthly water bill",
    value: 100.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: group2.id,
  });

  await expect(
    caller.bill.delete.one({
      billId: bill1.id,
      userId: user2.id,
    }),
  ).rejects.toThrowError("User is not the owner of the bill");

  const deletedBill = await caller.bill.get.one({
    billId: bill1.id,
  });
  expect(deletedBill).toEqual(expect.objectContaining(bill1));
});
