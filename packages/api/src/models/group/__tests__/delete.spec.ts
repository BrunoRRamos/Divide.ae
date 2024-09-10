import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller } from "../../..";
import { createTRPCContext } from "../../../trpc";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("Should delete a group", async () => {
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
  const deleteGroup = await caller.group.delete.one({ id: baseGroup.id });
  expect(deleteGroup).toEqual(
    expect.objectContaining({
      name: "Contas do mes",
      description: "Organizar as contas do mes",
    }),
  );
});
