import { Prisma, PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

export * from "@prisma/client";
export { Prisma };
