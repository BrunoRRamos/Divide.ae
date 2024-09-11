import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller, createTRPCContext } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("should update a bill", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  const bill = await caller.bill.create.one({
    name: "Monthly Subscription",
    description: "Subscription for monthly service",
    value: 100.0,
    quantity: 1,
    recurringPeriod: 30,
    groupId: "some-group-id",
  });

  const updatedBill = await caller.bill.update.one({
    id: bill.id,
    name: "Yearly Subscription",
    value: 1200.0,
    quantity: 1,
    groupId: "",
  });

  expect(updatedBill).toEqual(
    expect.objectContaining({
      id: bill.id,
      name: "Yearly Subscription",
      value: 1200.0,
    }),
  );
});

it("should not update a bill that does not exist", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  await expect(() =>
    caller.bill.update.one({
      id: "non-existing-id",
      name: "Yearly Subscription",
      value: 1200.0,
      groupId: "",
    }),
  ).rejects.toThrowError("Bill not found");
});
