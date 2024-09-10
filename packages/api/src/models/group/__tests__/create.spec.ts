import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller } from "../../..";
import { createTRPCContext } from "../../../trpc";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("Should create a new group", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const createGroup = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    userId: "kffjjek3345",
    closedAt: null,
    fixedTax: 0,
    variableTax: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  expect(createGroup).toEqual(
    expect.objectContaining({
      name: "Aniversario de Caique",
      description: "Comprar torta, salgados e refrigerante",
    }),
  );
});
