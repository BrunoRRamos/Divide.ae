import { createTRPCRouter } from "../../trpc";
import { createReceiptProcedure } from "./controllers/create";

const createRouter = createTRPCRouter({
  one: createReceiptProcedure,
});

export const receiptRouter = createTRPCRouter({
  create: createRouter,
});
