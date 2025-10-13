import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("환경변수 값이 없습니다.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
