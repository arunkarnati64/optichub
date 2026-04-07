import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('5000'),
  MONGODB_URI: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('onboarding@resend.dev'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
