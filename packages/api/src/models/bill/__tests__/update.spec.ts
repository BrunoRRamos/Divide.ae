import { PrismockClient } from "prismock";
import { afterEach, expect, it, vi } from "vitest";

import { db } from "@/db";

import type { Context } from "../../..";
import { createCaller } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

afterEach(async () => {
  // @ts-expect-error db is a mock
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await db.reset();
});

it("should update a bill", async () => {
  const user = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
  });

  const caller = createCaller({ db, auth: { user } } as Context);

  const group = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    fixedTax: 0,
  });

  const bill = await caller.bill.create.one({
    name: "Electricity",
    description: "Monthly electricity bill",
    value: 150.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: group.id,
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
  const user = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
  });

  const caller = createCaller({ db, auth: { user } } as Context);

  const group = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    fixedTax: 0,
  });

  const bill = await caller.bill.create.one({
    name: "Electricity",
    description: "Monthly electricity bill",
    value: 150.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: group.id,
  });

  const user2 = await db.user.create({
    data: {
      clerkId: "",
      name: "User 2",
      email: "user@gmail.com",
    },
  });

  const group2 = await caller.group.create.one({
    name: "Group 2",
    description: "Group 2",
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
