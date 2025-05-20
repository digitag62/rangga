import { PrismaClient } from "./generated/prisma";

export const prismadb = new PrismaClient();
// use `prisma` in your application to read and write data in your DB
