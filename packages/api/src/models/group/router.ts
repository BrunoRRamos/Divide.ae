import { createTRPCRouter } from "../../trpc";
import { createOneGroupProcedure } from "./controller/create";
import { deleteOneGroupProcedure } from "./controller/delete";
import {
  getAllGroupsProcedure,
  getOneGroupProcedure,
  getTotalValueFromGroupProcedure,
  getOneGroupProcedureWithTotalValue,
} from "./controller/get";
import {
  connectUserToGroupProcedure,
  updateOneGroupProcedure,
} from "./controller/update";

const getRouter = createTRPCRouter({
  one: getOneGroupProcedure,
  many: getAllGroupsProcedure,
  value: getTotalValueFromGroupProcedure,
  totalValue: getOneGroupProcedureWithTotalValue,
});

const createRouter = createTRPCRouter({
  one: createOneGroupProcedure,
});

const updateRouter = createTRPCRouter({
  one: updateOneGroupProcedure,
  addUser: connectUserToGroupProcedure,
});

const deleteRouter = createTRPCRouter({
  one: deleteOneGroupProcedure,
});

export const groupRouter = createTRPCRouter({
  get: getRouter,
  create: createRouter,
  update: updateRouter,
  delete: deleteRouter,
});