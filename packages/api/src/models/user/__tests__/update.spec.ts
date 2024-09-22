import { PrismockClient } from "prismock";
import { expect, it, vi } from "vitest";

import { db } from "@/db";

import { createCaller, createContextInner } from "../../..";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});

it("should update a user", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);
  const user = await db.user.create({
    data: {
      clerkId: "",
      name: "Caique",
      email: "caique.email@gmail.com",
    },
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

it("should not update a user that does not exist", async () => {
  const ctx = await createContextInner({});
  const caller = createCaller(ctx);
  await expect(() =>
    caller.user.update.one({
      id: "non-existing-id",
      name: "Caique Reis",
    }),
  ).rejects.toThrowError("User not found");
});
