import { PrismaClient } from "./generated/prisma/index.js"; // ← pakai path hasil generate

const prisma = new PrismaClient();

export default prisma;
