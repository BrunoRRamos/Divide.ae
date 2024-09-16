import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller, createContextInner } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("Should update a group", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);
  const baseGroup = await caller.group.create.one({
    name: "Contas do mes",
    description: "Organizar as contas do mes",
    userId: "ewfewwv335dcv",
    fixedTax: 0,
    variableTax: 0,
  });

  const updateGroup = await caller.group.update.one({
    id: baseGroup.id,
    name: "Aniversario de Bruno",
    description: "Comprar torta, salgados e dois refrigerante",
  });
  expect(updateGroup).toEqual(
    expect.objectContaining({
      name: "Aniversario de Bruno",
      description: "Comprar torta, salgados e dois refrigerante",
    }),
  );
});
