import { describe, expect, it } from "vitest";

import { createCaller, createTRPCContext } from "../../..";

const ctx = createTRPCContext({ headers: new Headers() });
const caller = createCaller(ctx);
const createGroup = await caller.group.create.one({
  name: "Contas do mes",
  description: "Organizar as contas do mes",
  userId: "ewfewwv335dcv",
  closedAt: null,
  fixedTax: 0,
  variableTax: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const groupId = createGroup.id;

describe("Groups test suite: (create, get, update and delete)", () => {
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

  it("Should get a group by id", async () => {
    const ctx = createTRPCContext({ headers: new Headers() });
    const caller = createCaller(ctx);
    const getById = await caller.group.get.one({ id: groupId });

    expect(getById).toEqual(
      expect.objectContaining({
        name: "Aniversario de Caique",
        description: "Comprar torta, salgados e refrigerante",
      }),
    );
  });

  it("Should get all groups", async () => {
    const ctx = createTRPCContext({ headers: new Headers() });
    const caller = createCaller(ctx);
    const getAllGroups = await caller.group.get.many();

    expect(getAllGroups).toEqual(
      expect.arrayContaining([
        {
          name: "Aniversario de Caique",
          description: "Comprar torta, salgados e refrigerante",
        },
        {
          name: "Contas do mes",
          description: "Organizar as contas do mes",
        },
      ]),
    );
  });

  it("Should update a group", async () => {
    const ctx = createTRPCContext({ headers: new Headers() });
    const caller = createCaller(ctx);
    const updateGroup = await caller.group.update.one({
      id: groupId,
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

  it("Should delete a group", async () => {
    const ctx = createTRPCContext({ headers: new Headers() });
    const caller = createCaller(ctx);
    const deleteGroup = await caller.group.delete.one({ id: groupId });
    expect(deleteGroup).toEqual(
      expect.objectContaining({
        name: "Aniversario de Bruno",
        description: "Comprar torta, salgados e dois refrigerante",
      }),
    );
  });
});
