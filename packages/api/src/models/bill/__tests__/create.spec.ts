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

it("should create a bill", async () => {
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
  const user = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
  });

  const caller = createCaller({ db, auth: { user } } as Context);

  await expect(
    caller.bill.create.one({
      name: "teste",
      description: "Monthly electricity bill",
      value: 150.75,
      quantity: 1,
      recurringPeriod: 30,
      groupId: "",
    }),
  ).rejects.toThrow();
});

it.skip("should not create a bill if user does not belong to group", async () => {
  const user = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
  });

  const groupOwner = await db.user.create({
    data: {
      clerkId: "",
      name: "Joao",
      email: "joao@gmail.com",
    },
  });

  const group = await db.group.create({
    data: {
      name: "Aniversario de Caique",
      description: "Comprar torta, salgados e refrigerante",
      fixedTax: 0,
      userId: groupOwner.id,
      code: "1234",
    },
    include: { users: true },
  });

  const caller = createCaller({ db, auth: { user } } as Context);

  await expect(
    caller.bill.create.one({
      name: "teste",
      description: "Monthly electricity bill",
      value: 150.75,
      quantity: 1,
      recurringPeriod: 30,
      groupId: group.id,
    }),
  ).rejects.toThrow();
});
