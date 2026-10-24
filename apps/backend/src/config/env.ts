import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

if (process.env.BASE_URL === "/") {
  process.env.BASE_URL = "http://localhost:5000";
}

const envSchema = z.object({
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/clickon_db"),
  REDIS_URL: z.string().optional().default("redis://localhost:6379"),

  JWT_ACCESS_SECRET: z.string().min(1).default("default_access_secret"),
  JWT_REFRESH_SECRET: z.string().min(1).default("default_refresh_secret"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  PORT: z.coerce.number().default(5000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  BASE_URL: z.string().default("http://localhost:5000"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),

  RESEND_API_KEY: z.string().optional(),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
