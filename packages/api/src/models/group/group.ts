import { createTRPCRouter } from "../../trpc";
import { createOneGroupProcedure } from "./controller/create";
import { deleteOneGroupProcedure } from "./controller/delete";
import { getAllGroupsProcedure, getOneGroupProcedure } from "./controller/get";
import { updateOneGroupProcedure } from "./controller/update";

const getRouter = createTRPCRouter({
  one: getOneGroupProcedure,
  many: getAllGroupsProcedure,
});

const createRouter = createTRPCRouter({
  one: createOneGroupProcedure,
});

const updateRouter = createTRPCRouter({
  one: updateOneGroupProcedure,
});

const deleteRouter = createTRPCRouter({
  one: deleteOneGroupProcedure,
});

export const groupRouter = createTRPCRouter({
  get: getRouter,
  cretate: createRouter,
  update: updateRouter,
  delete: deleteRouter,
});