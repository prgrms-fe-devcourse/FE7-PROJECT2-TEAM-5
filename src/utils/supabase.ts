import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error("환경변수 값이 없습니다.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
