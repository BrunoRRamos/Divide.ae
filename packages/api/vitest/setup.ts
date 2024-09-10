import { PrismockClient } from "prismock";
import { vi } from "vitest";

vi.mock("@/db", () => {
  return { db: new PrismockClient() };
});
