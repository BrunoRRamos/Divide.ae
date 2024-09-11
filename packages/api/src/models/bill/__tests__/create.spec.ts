import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller, createTRPCContext } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("should create a bill", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const bill = await caller.bill.create.one({
    name: "Electricity",
    description: "Monthly electricity bill",
    value: 150.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: "some-group-id",
  });
  expect(bill).toEqual(
    expect.objectContaining({
      name: "Electricity",
      description: "Monthly electricity bill",
      value: 150.75,
      quantity: 1,
      recurringPeriod: 30,
      groupId: "some-group-id",
    }),
  );
});

it("should not create a bill with blank name", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  await expect(
    caller.bill.create.one({
      name: "",
      description: "Monthly electricity bill",
      value: 150.75,
      quantity: 1,
      recurringPeriod: 30,
      groupId: "some-group-id",
    }),
  ).rejects.toThrow();
});
