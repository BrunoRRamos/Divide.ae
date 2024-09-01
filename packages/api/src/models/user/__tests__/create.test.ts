import { beforeAll, expect, it } from "vitest";

import { createCaller, createTRPCContext } from "../../..";

beforeAll(() => {});

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
