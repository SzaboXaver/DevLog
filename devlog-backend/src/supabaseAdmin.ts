import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

export const supabaseAdmin = createClient(
    process.env.SUPABASE_PROJECT_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);