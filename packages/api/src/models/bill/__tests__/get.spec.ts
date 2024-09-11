import { PrismockClient } from "prismock";
import { afterEach, expect, it, vi } from "vitest";

import { createCaller, createTRPCContext } from "../../..";
import { db } from "@/db";

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
  const bill = await caller.bill.create.one({
    name: "Rent",
    description: "Monthly apartment rent",
    value: 1200.50,
    quantity: 1,
    recurringPeriod: 30,
    groupId: "groupIdExample", 
  });
  const getBill = await caller.bill.get.one({ id: bill.id });
  expect(getBill).toEqual(
    expect.objectContaining({
      id: bill.id,
      name: "Rent",
      description: "Monthly apartment rent",
      value: 1200.50,
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

it("should get all bills", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  
  await caller.bill.create.one({
    name: "Rent",
    description: "Monthly apartment rent",
    value: 1200.50,
    quantity: 1,
    recurringPeriod: 30,
    groupId: "groupIdExample", 
  });

  await caller.bill.create.one({
    name: "Utilities",
    description: "Monthly utilities",
    value: 200.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: "groupIdExample", 
  });

  const bills = await caller.bill.get.all();
  expect(bills.length).toEqual(2);
});
