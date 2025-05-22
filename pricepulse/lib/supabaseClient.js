import { createClient } from "@supabase/supabase-js";
// taking the env variable , create client connects the app with the supa base server 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);//connecting with the env variables 
