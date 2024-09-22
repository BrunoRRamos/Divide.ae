import { createTRPCRouter } from "../../trpc";
import { createBill } from "./controllers/create";
import { deleteBill } from "./controllers/delete";
import { getAllBillsByGroup, getBillById } from "./controllers/get";
import { updateBill } from "./controllers/update";

const createBillRouter = createTRPCRouter({
  one: createBill,
});

const getBillRouter = createTRPCRouter({
  one: getBillById,
  all: getAllBillsByGroup,
});

const deleteBillRouter = createTRPCRouter({
  one: deleteBill,
});

const updateBillRouter = createTRPCRouter({
  one: updateBill,
});

export const billRouter = createTRPCRouter({
  create: createBillRouter,
  update: updateBillRouter,
  get: getBillRouter,
  delete: deleteBillRouter,
});

