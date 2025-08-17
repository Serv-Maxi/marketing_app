import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Client-side Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// // Server-side Supabase client (for API routes)
// export const createServerSupabaseClient = () => {
//   return createClient<Database>(supabaseUrl, supabaseAnonKey, {
//     auth: {
//       autoRefreshToken: false,
//       persistSession: false,
//     },
//   });
// };

// Export types for TypeScript
export type { Database };
