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
  const getBill = await caller.bill.get.one({ id: bill.id });
  expect(getBill).toEqual(
    expect.objectContaining({
      id: bill.id,
      name: "Rent",
      description: "Monthly apartment rent",
      value: 1200.5,
      quantity: 1,
      recurringPeriod: 30,
      groupId: "groupIdExample",
    }),
  );
});

it("should not get an uncreated bill", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const bill = await caller.bill.get.one({ id: "notCreatedId" });
  expect(bill).toBeNull();
});

// it("should get all bills from a group", async () => {
//   const ctx = createTRPCContext({ headers: new Headers() });
//   const caller = createCaller(ctx);

//   await caller.group.create.one({
//     name: "Aniversario de Caique",
//     description: "Comprar torta, salgados e refrigerante",
//     userId: "kffjjek3345",
//     closedAt: null,
//     fixedTax: 0,
//     variableTax: 0,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   });

//   await caller.bill.create.one({
//     name: "saguado",
//     description: "Monthly apartment rent",
//     value: 1200.5,
//     quantity: 1,
//     recurringPeriod: 30,
//     groupId: "Aniversario de Caique",
//     userId: "kffjjek3345",
//   });

//   await caller.bill.create.one({
//     name: "dolce",
//     description: "Monthly utilities",
//     value: 200.75,
//     quantity: 1,
//     recurringPeriod: 30,
//     groupId: "Aniversario de Caique",
//     userId: "kffjjek3345",
//   });

//   const bills = await caller.bill.get.all({ groupId: "Aniversario de Caique" });
//   expect(bills.length).toEqual(2);
// });
