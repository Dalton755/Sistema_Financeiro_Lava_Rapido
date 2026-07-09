import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SUPABASE_URL) {
    throw new Error("SUPABASE_URL não encontrada no .env");
}

if (!process.env.SUPABASE_SERVICE_KEY) {
    throw new Error("SUPABASE_SERVICE_KEY não encontrada no .env");
}

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);