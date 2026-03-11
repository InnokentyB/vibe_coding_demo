import { createClient } from '@supabase/supabase-js';
import { env } from './env';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

console.log(`[DB Initialization] Connected to Supabase at ${env.SUPABASE_URL}`);

/**
 * Returns the configured Supabase client instance.
 * @returns The Supabase client.
 */
export const getDb = () => supabase;
