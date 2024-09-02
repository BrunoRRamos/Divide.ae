import { beforeAll, expect, it } from "vitest";

import { createCaller, createTRPCContext } from "../../..";

beforeAll(() => {});

it("should create a bill", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const bill = await caller.bill.create.one({
    name: "Internet",
    value: 100,
    quantity: 1,
    groupId: "group-123",
  });

  expect(bill).toEqual(
    expect.objectContaining({
      name: "Internet",
      value: 100,
      quantity: 1,
      groupId: "group-123",
    }),
  );
});

it("should not create a bill with missing required fields", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  await expect(
    caller.bill.create.one({
      name: "Incomplete Bill",
      value: 0,
      groupId: "",
    }),
  ).rejects.toThrow();
});

it("should delete a bill", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  const bill = await caller.bill.create.one({
    name: "Water Bill",
    value: 50,
    quantity: 1,
    groupId: "group-456",
  });

  const deletedBill = await caller.bill.delete.one(bill.id);

  expect(deletedBill).toEqual(expect.objectContaining({ id: bill.id }));

  const fetchedBill = await caller.bill.get.one.byId({ id: bill.id });
  expect(fetchedBill).toBeNull();
});

it("should not delete a non-existing bill", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  await expect(caller.bill.delete.one("non-existing-id")).rejects.toThrow();
});

it("should fetch a bill by ID", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  const bill = await caller.bill.create.one({
    name: "Electricity",
    value: 75,
    quantity: 1,
    groupId: "group-789",
  });

  const fetchedBill = await caller.bill.get.one.byId({ id: bill.id });

  expect(fetchedBill).toEqual(expect.objectContaining({ id: bill.id }));
});

it("should return null for non-existing bill ID", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  const fetchedBill = await caller.bill.get.one.byId({ id: "non-existing-id" });

  expect(fetchedBill).toBeNull();
});

it("should fetch all bills", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  await caller.bill.create.one({
    name: "Internet",
    value: 100,
    quantity: 1,
    groupId: "group-123",
  });
  await caller.bill.create.one({
    name: "Electricity",
    value: 75,
    quantity: 1,
    groupId: "group-789",
  });

  const bills = await caller.bill.get.all();

  expect(bills.length).toBeGreaterThanOrEqual(2);
});

it("should update a bill", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const bill = await caller.bill.create.one({
    name: "Gas Bill",
    value: 60,
    quantity: 1,
    groupId: "group-555",
  });

  const updatedBill = await caller.bill.update.one({
    id: bill.id,
    groupId: "group-555",
    amount: 80,
    description: "Updated Gas Bill",
  });

  expect(updatedBill).toEqual(
    expect.objectContaining({
      id: bill.id,
      groupId: "group-555",
      amount: 80,
      description: "Updated Gas Bill",
    }),
  );
});

it("should not update a non-existing bill", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  await expect(
    caller.bill.update.one({
      id: "non-existing-id",
      groupId: "group-555",
      amount: 80,
      description: "Updated Gas Bill",
    }),
  ).rejects.toThrow();
});
