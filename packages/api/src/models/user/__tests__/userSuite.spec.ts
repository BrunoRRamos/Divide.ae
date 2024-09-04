import { expect, it } from "vitest";

import { createCaller, createTRPCContext } from "../../..";

it("should create a user", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const user = await caller.user.create.one({
    name: "Caique",
    email: "caiquito@ccc.reidelas",
  });
  expect(user).toEqual(
    expect.objectContaining({
      name: "Caique",
      email: "caiquito@ccc.reidelas",
    }),
  );
});

it("should not create a user with blank a name", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  expect(
    caller.user.create.one({
      name: "",
      email: "caiquito@ccc.reidelas",
    }),
  ).rejects.toThrow();
});

it("should get a created user", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const user = await caller.user.create.one({
    name: "Caique",
    email: "caique.email@gmail.com",
  });

  const getUser = await caller.user.get.one({ id: user.id });
  expect(getUser).toEqual(
    expect.objectContaining({
      id: user.id,
      name: "Caique",
      email: "caique.email@gmail.com",
    }),
  );
});

it("should get all users", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const user1 = await caller.user.create.one({
    name: "Caique",
    email: "caique.email@gmail.com",
  });

  const user2 = await caller.user.create.one({
    name: "Jorge",
    email: "jorgin@balalove.verygood",
  });

  const users = await caller.user.get.all();
  expect(users.length).toEqual(2);
});

it("should delete a bill", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const user = await caller.user.create.one({
    name: "Caique",
    email: "caique.email@gmail.com",
  });
  const deleteUser = await caller.user.delete.one(user.id);
  expect(deleteUser).toEqual(expect.objectContaining({ id: user.id }));

  const deletedUser = await caller.user.get.one({ id: user.id });
  expect(deletedUser).toBeNull();
});

it("shoud not delete a user that does not exist", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  expect(caller.user.delete.one("non-existing-id")).rejects.toThrow();
});

it("should update a user", async () => {
  const ctx = createTRPCContext({ headers: new Headers() });
  const caller = createCaller(ctx);
  const user = await caller.user.create.one({
    name: "Caique",
    email: "caique.email@gmail.com",
  });
  const updatedUser = await caller.user.update.one({
    id: user.id,
    name: "Caique Reis",
  });
  expect(updatedUser).toEqual(
    expect.objectContaining({
      id: user.id,
      name: "Caique Reis",
    }),
  );
});
