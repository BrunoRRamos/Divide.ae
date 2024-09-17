import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller, createContextInner } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("Should create a new group", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);
  const createGroup = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    userId: "kffjjek3345",
    fixedTax: 0,
    variableTax: 0,
  });
  expect(createGroup).toEqual(
    expect.objectContaining({
      name: "Aniversario de Caique",
      description: "Comprar torta, salgados e refrigerante",
    }),
  );
});
