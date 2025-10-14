import supabase from "../../utils/supabase";
import { Link } from "react-router";

// 로그인 페이지
export default function LoginPage() {
	const handleGoogleLogin = () => {
		console.log("Google login");
	};

	const handleKakaoLogin = async () => {
		console.log("kakao login");
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "kakao",
			options: {
				redirectTo: `${import.meta.env.VITE_URL}/`,
			},
		});

		if (error) alert(error.message);

		if (data) console.log(data);
	};
	return (
		<>
			<h4 className="text-[28px] font-black mb-6 text-[#8b5cf6] text-center">
				로그인
			</h4>
			<form className="w-full flex flex-col gap-4 mb-7">
				<input
					id="login-email"
					type="text"
					placeholder="이메일"
					className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none"
				/>
				<input
					id="login-password"
					type="password"
					placeholder="비밀번호"
					className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none"
				/>

				<button
					type="submit"
					className="cursor-pointer w-full h-11 text-white font-semibold rounded-xl bg-[#8B5CF6]"
				>
					로그인
				</button>
			</form>

			<div className="flex flex-col gap-4 items-center mb-3">
				<div className="text-xs text-[#6B7280]">
					또는 소셜 계정으로 로그인
				</div>
				<button
					type="submit"
					className="cursor-pointer w-full h-11 text-white rounded-xl bg-[#4285F4] font-medium"
					onClick={handleGoogleLogin}
				>
					Google 로그인
				</button>
				<button
					type="submit"
					className="cursor-pointer w-full h-11 rounded-xl bg-[#FEE500] font-medium"
					onClick={handleKakaoLogin}
				>
					Kakao 로그인
				</button>
				<button
					type="submit"
					className="cursor-pointer w-full h-11 text-white rounded-xl bg-[#03C75A] font-medium"
				>
					Naver 로그인
				</button>
			</div>

			<div className="text-sm text-[#8B5CF6] text-center">
				<Link to="/register">
					계정이 없나요? <strong>회원가입</strong>
				</Link>
			</div>
		</>
	);
}
