import { createClient } from '@supabase/supabase-js';
import configuration from '../configs/configuration';
const envs = configuration();
if (!envs.SUPABASE_URL || !envs.SUPABASE_ANON_KEY) throw Error("SUPABASE_URL: Env not found")
export const supabase = createClient(envs.SUPABASE_URL, envs.SUPABASE_ANON_KEY);