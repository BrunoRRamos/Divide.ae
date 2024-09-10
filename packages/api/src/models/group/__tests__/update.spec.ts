import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller } from "../../..";
import { createTRPCContext } from "../../../trpc";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("Should update a group", async () => {
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
