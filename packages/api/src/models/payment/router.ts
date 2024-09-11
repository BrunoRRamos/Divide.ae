import { createTRPCRouter } from "../../trpc";
import { createPaymentProcedure } from "./controllers/create";
import { deletePaymentProcedure } from "./controllers/delete";
import {
  getPaymentProcedure,
  getPaymentsFromGroupProcedure,
  getPaymentsFromUserProcedure,
} from "./controllers/get";
import { updatePaymentProcedure } from "./controllers/update";

const createRouter = createTRPCRouter({
  one: createPaymentProcedure,
});

const updateRouter = createTRPCRouter({
  one: updatePaymentProcedure,
});

const deleteRouter = createTRPCRouter({
  one: deletePaymentProcedure,
});

const getManyRouter = createTRPCRouter({
  group: getPaymentsFromGroupProcedure,
  user: getPaymentsFromUserProcedure,
});

const getRouter = createTRPCRouter({
  many: getManyRouter,
  one: getPaymentProcedure,
});

export const paymentRouter = createTRPCRouter({
  create: createRouter,
  update: updateRouter,
  delete: deleteRouter,
  get: getRouter,
});
