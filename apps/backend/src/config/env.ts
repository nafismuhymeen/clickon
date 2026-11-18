import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), "apps/backend/.env") });
dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });

if (process.env.BASE_URL === "/") {
  process.env.BASE_URL = "http://localhost:5000";
}

const isProd = process.env.NODE_ENV === "production";

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .default("postgresql://postgres:postgres@localhost:5432/clickon_db"),
  REDIS_URL: z.string().optional().default("redis://localhost:6379"),

  JWT_ACCESS_SECRET: isProd
    ? z
        .string({
          required_error: "JWT_ACCESS_SECRET is required in production",
        })
        .min(
          32,
          "JWT_ACCESS_SECRET must be at least 32 characters long in production"
        )
    : z
        .string()
        .min(1)
        .default(
          "default_access_secret_development_minimum_32_characters_long"
        ),

  JWT_REFRESH_SECRET: isProd
    ? z
        .string({
          required_error: "JWT_REFRESH_SECRET is required in production",
        })
        .min(
          32,
          "JWT_REFRESH_SECRET must be at least 32 characters long in production"
        )
    : z
        .string()
        .min(1)
        .default(
          "default_refresh_secret_development_minimum_32_characters_long"
        ),

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
  CONTACT_EMAIL_TO: z.string().optional().default("support@clickon.io"),
  CONTACT_EMAIL_FROM: z.string().optional().default("noreply@clickon.io"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
