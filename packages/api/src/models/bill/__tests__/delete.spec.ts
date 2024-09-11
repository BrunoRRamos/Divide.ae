import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller, createTRPCContext } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("should create and delete a bill", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  const bill = await caller.bill.create.one({
    name: "Electricity Bill",
    description: "Monthly electricity bill",
    value: 120.50,
    quantity: 1,
    recurringPeriod: 30, 
    groupId: "group-id-example", 
  });

  const deleteBill = await caller.bill.delete.one(bill.id);
  expect(deleteBill).toEqual(expect.objectContaining({ id: bill.id }));

  const deletedBill = await caller.bill.get.one({ id: bill.id });
  expect(deletedBill).toBeNull();
});

it("should not delete a bill that does not exist", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  await expect(() =>
    caller.bill.delete.one("non-existing-id"),
  ).rejects.toThrowError("Bill not found");
});
