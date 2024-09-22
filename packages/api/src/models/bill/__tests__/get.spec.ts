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

it("should get a created bill", async () => {
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

  const getBill = await caller.bill.get.one({
    billId: bill.id,
  });

  expect(getBill).toEqual(
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

it("should get all bills from a group", async () => {
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

  await caller.bill.create.one({
    name: "Electricity",
    description: "Monthly electricity bill",
    value: 150.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: group.id,
  });

  await caller.bill.create.one({
    name: "Gas",
    description: "Monthly gas bill",
    value: 100.75,
    quantity: 1,
    recurringPeriod: 30,
    groupId: group.id,
  });

  const bills = await caller.bill.get.all({
    groupId: group.id,
    userId: user.id,
  });

  expect(bills.length).toEqual(2);

  expect(bills).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: "Electricity",
        value: 150.75,
      }),
      expect.objectContaining({
        name: "Gas",
        value: 100.75,
      }),
    ]),
  );
});

it.skip("should not get a bill from another group", async () => {
  const userOwner = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
  });

  const caller = createCaller({ db, auth: { user: userOwner } } as Context);

  const group1 = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    fixedTax: 0,
  });

  const user2 = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
  });

  const bill = await db.bill.create({
    data: {
      name: "Electricity",
      description: "Monthly electricity bill",
      value: 150.75,
      quantity: 1,
      recurringPeriod: 30,
      groupId: group1.id,
      userId: user2.id,
    },
  });

  await expect(
    caller.bill.get.one({
      billId: bill.id,
    }),
  ).rejects.toThrowError("User is not the owner of the bill");
});
