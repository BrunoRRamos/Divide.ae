import type { PrismockClientType } from "prismock/build/main/lib/client";
import { PrismockClient } from "prismock";
import { afterAll, beforeAll, expect, it, vi } from "vitest";

import { db } from "@/db";

import { createCaller } from "../../..";
import { createTRPCContext } from "../../../trpc";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

let userId: string;
let groupId: string;

beforeAll(async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const user = await caller.user.create.one({
    name: "Pedro",
    email: "pedro@gmail.com",
  });
  userId = user.id;
  const group = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    userId: "kffjjek3345",
    closedAt: null,
    fixedTax: 0,
    variableTax: 0,
  });
  groupId = group.id;
});

afterAll(() => {
  (db as PrismockClientType).reset();
});

it("should create a payment", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  const createPayment = await caller.payment.create.one({
    value: 100,
    userId,
    groupId,
  });

  expect(createPayment).toEqual(
    expect.objectContaining({
      value: 100,
      userId,
      groupId,
    }),
  );
});

it("should not create a payment with negative value", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  await expect(
    caller.payment.create.one({
      value: -100,
      userId,
      groupId,
    }),
  ).rejects.toThrowError();
});

it("should not create a payment with empty userId", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  await expect(
    caller.payment.create.one({
      value: 100,
      groupId,
      userId: "",
    }),
  ).rejects.toThrowError();
});

it("should not create a payment with empty groupId", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);

  await expect(
    caller.payment.create.one({
      value: 100,
      userId,
      groupId: "",
    }),
  ).rejects.toThrowError();
});
