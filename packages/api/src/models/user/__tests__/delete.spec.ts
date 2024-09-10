import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller, createTRPCContext } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("should delete a user", async () => {
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
  await expect(() =>
    caller.user.delete.one("non-existing-id"),
  ).rejects.toThrowError("User not found");
});