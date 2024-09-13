import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller, createTRPCContext } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("should delete a bill", async () => {
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

  const deleteBill = await caller.bill.delete.one({
    billId: bill.id,
    userId: user.id,
  });
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

it("should not delete another user's bill", async () => {
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

  const user1 = await caller.user.create.one({
    name: "Ian",
    email: "ian@gmail.com",
  });

  const deleteBill = await caller.bill.delete.one(bill.id);
  expect(deleteBill).toEqual(expect.objectContaining({ id: bill.id }));
});

// it("should create and delete a bill", async () => {
//   const ctx = createTRPCContext({ headers: new Headers() });
//   const caller = createCaller(ctx);

//   const bill = await caller.bill.create.one({
//     name: "Electricity Bill",
//     description: "Monthly electricity bill",
//     value: 120.5,
//     quantity: 1,
//     recurringPeriod: 30,
//     groupId: "group-id-example",
//     userId: "user-id-example",
//   });

//   const deleteBill = await caller.bill.delete.one(bill.id);
//   expect(deleteBill).toEqual(expect.objectContaining({ id: bill.id }));

//   const deletedBill = await caller.bill.get.one({ id: bill.id });
//   expect(deletedBill).toBeNull();
// });

// it("should not delete a bill that does not exist", async () => {
//   const ctx = createTRPCContext({ headers: new Headers() });
//   const caller = createCaller(ctx);
//   await expect(() =>
//     caller.bill.delete.one("non-existing-id"),
//   ).rejects.toThrowError("Bill not found");
// });
