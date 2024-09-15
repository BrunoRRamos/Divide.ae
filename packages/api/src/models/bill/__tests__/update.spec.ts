import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller, createTRPCContext } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("should update a bill", async () => {
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
  const updatedBill = await caller.bill.update.one({
    id: bill.id,
    name: "Yearly Subscription",
    description: "Yearly subscription for the service",
    value: 1200.0,
    quantity: 1,
    recurringPeriod: 365,
    myUserId: user.id,
  });

  expect(updatedBill).toEqual(
    expect.objectContaining({
      id: bill.id,
      name: "Yearly Subscription",
      value: 1200.0,
      quantity: 1,
    }),
  );
});

it("should not update a bill that does not belong to the user", async () => {
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

  const user2 = await caller.user.create.one({
    name: "User 2",
    email: "user@gmail.com",
  });

  const group2 = await caller.group.create.one({
    name: "Group 2",
    description: "Group 2",
    userId: user2.id,
    closedAt: null,
    fixedTax: 0,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const bill2 = await caller.bill.create.one({
    name: "Electricity",
    description: "Monthly electricity bill",
    value: 150.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: group2.id,
    userId: user2.id,
  });

  await expect(() =>
    caller.bill.update.one({
      id: bill.id,
      name: "Yearly Subscription",
      description: "Yearly subscription for the service",
      value: 1200.0,
      quantity: 1,
      recurringPeriod: 365,
      myUserId: user2.id,
    }),
  ).rejects.toThrowError("User is not the owner of the bill");
});
