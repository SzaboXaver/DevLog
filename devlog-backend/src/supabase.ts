import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SERVICE_KEY!,
);

export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
);