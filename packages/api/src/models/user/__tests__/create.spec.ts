import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { createCaller, createTRPCContext } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

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
  await expect(
    caller.user.create.one({
      name: "",
      email: "caiquito@ccc.reidelas",
    }),
  ).rejects.toThrow();
});