import { createTRPCRouter } from "../../trpc";
import { createUser } from "./controllers/create";
import { deleteUser } from "./controllers/delete";
import { getUsers, getUserById } from "./controllers/get";
import { updateUser } from "./controllers/update";

const createRouter = createTRPCRouter({
  one: createBill,
});

const getRouter = createTRPCRouter({
  one: getBillById,
  all: getBills,
});

const deleteBillRouter = createTRPCRouter({
  one: deleteBill,
});

const updateBillRouter = createTRPCRouter({
  one: updateBill,
});

export const userRouter = createTRPCRouter({
  create: createRouter,
  update: updateBillRouter,
  get: getRouter,
  delete: deleteBillRouter,
});
