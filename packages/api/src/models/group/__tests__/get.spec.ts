import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { Context, createCaller, createContextInner } from "../../..";
import { db } from "@/db";

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
  const user = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
  });

  const caller = createCaller({ db, auth: { user } } as Context);

  const baseGroup = await caller.group.create.one({
    name: "Aniversario de Caique",
    description: "Comprar torta, salgados e refrigerante",
    fixedTax: 0,
  });
  
  const getById = await caller.group.get.one({ id: baseGroup.id });
  expect(getById).toEqual(
    expect.objectContaining({
      name: "Aniversario de Caique",
      description: "Comprar torta, salgados e refrigerante",
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
    fixedTax: 0,
    variableTax: 0,
  });
  const getAllGroups = await caller.group.get.many();
  expect(getAllGroups.length).toEqual(2);
});
