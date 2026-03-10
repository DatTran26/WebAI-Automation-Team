import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma CLI uses DIRECT_URL to bypass PgBouncer during migrations
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
