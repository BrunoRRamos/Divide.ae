import { PrismockClient } from "prismock";
import { afterEach, expect, it, vi } from "vitest";

import { db } from "@/db";

import { createCaller, createContextInner } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

afterEach(async () => {
  // @ts-expect-error db is a mock
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await db.reset();
});

it("should get a created user", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);
  const user = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
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

it("should not get an uncreated user", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);
  const user = await caller.user.get.one({ id: "notCreatedId" });
  expect(user).toBeNull();
});

it("should get all users", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);
  await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
  });
  await db.user.create({
    data: {
      clerkId: "",
      name: "Jorge",
      email: "jorgin@balalove.verygood",
    },
  });

  const users = await caller.user.get.all();
  expect(users.length).toEqual(2);
});
