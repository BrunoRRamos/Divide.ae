import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller, createContextInner } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("Should delete a group", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);
  const baseGroup = await caller.group.create.one({
    name: "Contas do mes",
    description: "Organizar as contas do mes",
    fixedTax: 0,
    variableTax: 0,
  });
  const deleteGroup = await caller.group.delete.one({ id: baseGroup.id });
  expect(deleteGroup).toEqual(
    expect.objectContaining({
      name: "Contas do mes",
      description: "Organizar as contas do mes",
    }),
  );
});
