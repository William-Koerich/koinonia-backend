import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL!;
const isLocalDb = /localhost|127\.0\.0\.1/.test(databaseUrl);

const adapter = new PrismaPg({
  connectionString: databaseUrl,
  ssl: isLocalDb ? undefined : { rejectUnauthorized: false },
});

export const prisma = new PrismaClient({ adapter });
