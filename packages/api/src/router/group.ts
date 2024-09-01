import { createOneGroupProcedure } from "../models/group/controller/create";
import { deleteOneGroupProcedure } from "../models/group/controller/delete";
import {
  getAllGroupsProcedure,
  getOneGroupProcedure,
} from "../models/group/controller/get";
import { updateOneGroupProcedure } from "../models/group/controller/update";
import { createTRPCRouter } from "../trpc";

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
