import { createTRPCRouter } from "../../trpc";
import { createUser } from "./controllers/create";
import { deleteUser } from "./controllers/delete";
import { getUserById, getUsers } from "./controllers/get";
import { updateUser } from "./controllers/update";

const createRouter = createTRPCRouter({
  one: createUser,
});

const getRouter = createTRPCRouter({
  one: getUserById,
  all: getUsers,
});

const deleteUserRouter = createTRPCRouter({
  one: deleteUser,
});

const updateUserRouter = createTRPCRouter({
  one: updateUser,
});

export const userRouter = createTRPCRouter({
  create: createRouter,
  update: updateUserRouter,
  get: getRouter,
  delete: deleteUserRouter,
});
