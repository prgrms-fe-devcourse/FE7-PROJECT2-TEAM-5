import supabase from "../utils/supabase";

// 일단 네이버는 빼고.. supabase에서 지원 안함, 나중에 방법 찾아봄
export async function socialSignIn(provider: "kakao" | "google") {
	return await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: `${window.location.origin}/`,
		},
	});
}
