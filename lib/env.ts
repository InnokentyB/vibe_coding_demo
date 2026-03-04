import z from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().default('./data/database.sqlite'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error(
        '❌ Invalid environment variables:',
        parsed.error.flatten().fieldErrors
    );
    throw new Error('Invalid environment variables');
}

export const env = parsed.data;
