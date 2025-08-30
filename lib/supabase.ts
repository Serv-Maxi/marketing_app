import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Client-side Supabase browser client with SSR cookie sync
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

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
