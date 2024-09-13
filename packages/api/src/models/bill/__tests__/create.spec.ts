import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller, createTRPCContext } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("should create a bill", async () => {
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
  expect(bill).toEqual(
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

it("should not create a bill with blank group id", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  await expect(
    caller.bill.create.one({
      name: "teste",
      description: "Monthly electricity bill",
      value: 150.75,
      quantity: 1,
      recurringPeriod: 30,
      groupId: "",
      userId: "some",
    }),
  ).rejects.toThrow();
});

it("sould not create a bill if user does not belong to group", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  await expect(
    caller.bill.create.one({
      name: "teste",
      description: "Monthly electricity bill",
      value: 150.75,
      quantity: 1,
      recurringPeriod: 30,
      groupId: "some-group-id",
      userId: "some",
    }),
  ).rejects.toThrow();
});
