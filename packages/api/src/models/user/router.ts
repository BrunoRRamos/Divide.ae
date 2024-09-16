import { createTRPCRouter } from "../../trpc";
import { deleteUser } from "./controllers/delete";
import { getUserById, getUsers } from "./controllers/get";
import { updateUser } from "./controllers/update";

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
  update: updateUserRouter,
  get: getRouter,
  delete: deleteUserRouter,
});
