import { defineConfig } from "drizzle-kit";
export default defineConfig({
    schema: "./utils/schema.js",
    dialect: "postgresql",
    dbCredentials: {
         url:"postgresql://neondb_owner:npg_DPjkvfZR2I4b@ep-blue-glitter-a5ai07yl.us-east-2.aws.neon.tech/neondb?sslmode=require",
      }
  
});