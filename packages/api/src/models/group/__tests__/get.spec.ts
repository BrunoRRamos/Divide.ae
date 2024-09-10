import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller } from "../../..";
import { createTRPCContext } from "../../../trpc";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("Should get a group by id with inexistent id", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const getById = await caller.group.get.one({ id: "testId" });

  expect(getById).toBeNull();
});

it("Should get a group by id", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const baseGroup = await caller.group.create.one({
    name: "Contas do mes",
    description: "Organizar as contas do mes",
    userId: "ewfewwv335dcv",
    closedAt: null,
    fixedTax: 0,
    variableTax: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const getById = await caller.group.get.one({ id: baseGroup.id });
  expect(getById).toEqual(
    expect.objectContaining({
      name: "Contas do mes",
      description: "Organizar as contas do mes",
    }),
  );
});

it("Should get all groups with no one group regsitred", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const getAllGroups = await caller.group.get.many();
  expect(getAllGroups).toEqual(expect.arrayContaining([]));
});

it("Should get all groups", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  await caller.group.create.one({
    name: "Contas do mes",
    description: "Organizar as contas do mes",
    userId: "ewfewwv335dcv",
    closedAt: null,
    fixedTax: 0,
    variableTax: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const getAllGroups = await caller.group.get.many();
  expect(getAllGroups.length).toEqual(2);
});
