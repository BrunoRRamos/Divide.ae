import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller, createContextInner } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("Should get a group by id with inexistent id", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);
  const getById = await caller.group.get.one({ id: "testId" });

  expect(getById).toBeNull();
});

it("Should get a group by id", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);
  const baseGroup = await caller.group.create.one({
    name: "Contas do mes",
    description: "Organizar as contas do mes",
    userId: "ewfewwv335dcv",
    fixedTax: 0,
    variableTax: 0,
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
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);
  const getAllGroups = await caller.group.get.many();
  expect(getAllGroups).toEqual(expect.arrayContaining([]));
});

it("Should get all groups", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);
  await caller.group.create.one({
    name: "Contas do mes",
    description: "Organizar as contas do mes",
    userId: "ewfewwv335dcv",
    fixedTax: 0,
    variableTax: 0,
  });
  const getAllGroups = await caller.group.get.many();
  expect(getAllGroups.length).toEqual(2);
});
