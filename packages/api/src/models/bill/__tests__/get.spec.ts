import { PrismockClient } from "prismock";
import { afterEach, expect, it, vi } from "vitest";

import { db } from "@/db";

import { createCaller, createTRPCContext } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

afterEach(async () => {
  // @ts-expect-error db is a mock
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await db.reset();
});

it("should get a created bill", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  const user = await caller.user.create.one({
    name: "Caique",
    email: "caique@gmail.com",
  });

  const group = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    userId: user.id,
    closedAt: null,
    fixedTax: 0,
  });

  const bill = await caller.bill.create.one({
    name: "Electricity",
    description: "Monthly electricity bill",
    value: 150.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: group.id,
    userId: user.id,
  });
  const getBill = await caller.bill.get.one({
    billId: bill.id,
    userId: user.id,
  });
  expect(getBill).toEqual(
    expect.objectContaining({
      name: "Electricity",
      description: "Monthly electricity bill",
      value: 150.75,
      quantity: 1,
      recurringPeriod: 30,
      groupId: group.id,
      userId: user.id,
    }),
  );
});

it("should get all bills from a group", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  const user = await caller.user.create.one({
    name: "Caique",
    email: "caique@gmail.com",
  });

  const group = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    userId: user.id,
    closedAt: null,
    fixedTax: 0,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const bill1 = await caller.bill.create.one({
    name: "Electricity",
    description: "Monthly electricity bill",
    value: 150.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: group.id,
    userId: user.id,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const bill2 = await caller.bill.create.one({
    name: "Gas",
    description: "Monthly gas bill",
    value: 100.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: group.id,
    userId: user.id,
  });

  const bills = await caller.bill.get.all({
    groupId: group.id,
    userId: user.id,
  });

  expect(bills.length).toEqual(2);

  expect(bills).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: "Electricity",
        value: 150.75,
      }),
      expect.objectContaining({
        name: "Gas",
        value: 100.75,
      }),
    ]),
  );
});

//Não ta funcionando corretamente
it("should not get a bill from another group", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  const user1 = await caller.user.create.one({
    name: "Caique",
    email: "caique@gmail.com",
  });

  const group1 = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    userId: user1.id,
    closedAt: null,
    fixedTax: 0,
  });

  const bill1 = await caller.bill.create.one({
    name: "Electricity",
    description: "Monthly electricity bill",
    value: 150.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: group1.id,
    userId: user1.id,
  });

  const user2 = await caller.user.create.one({
    name: "Joao",
    email: "joao@gmail.com",
  });

  const group2 = await caller.group.create.one({
    name: "Aniversario de Joao",
    description: "Comprar torta, salgados e refrigerante",
    userId: user2.id,
    closedAt: null,
    fixedTax: 0,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const bill2 = await caller.bill.create.one({
    name: "Water",
    description: "Monthly water bill",
    value: 100.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: group2.id,
    userId: user2.id,
  });
  await expect(
    caller.bill.get.one({
      billId: bill1.id,
      userId: user2.id,
    }),
  ).rejects.toThrowError("User is not the owner of the bill");
});
