// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Use global var in dev to avoid multiple instances during HMR.
 * If prepared-statement errors persist in dev, uncomment the __internal flag below.
 */
const prisma = global.prisma ?? new PrismaClient();
// @ts-ignore: internal flag for workaround (dev only)
// { __internal: { disablePreparedStatements: true } }

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
