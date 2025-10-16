import supabase from "../../utils/supabase";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

// 로그인 페이지
export default function LoginPage() {
	const navigate = useNavigate();

	// 입력 상태 관리
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				setMessage(`로그인 실패: ${error.message}`);
				return;
			}

			if (data?.user) {
				navigate("/");
			} else {
				setMessage("사용자 정보를 가져올 수 없습니다.");
			}
		} catch (err) {
			console.error(err);
			setMessage("예상치 못한 오류가 발생했습니다.");
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = () => {
		console.log("Google login");
	};

	const handleKakaoLogin = async () => {
		console.log("kakao login");
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "kakao",
			options: {
				redirectTo: "/",
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

			<form
				className="w-full flex flex-col gap-4 mb-7"
				onSubmit={handleEmailLogin}
			>
				<input
					id="login-email"
					type="email"
					placeholder="이메일"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none"
				/>
				<input
					id="login-password"
					type="password"
					placeholder="비밀번호"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full h-11 rounded-xl border border-[#D1D5DB] px-4 outline-none"
				/>

				<button
					type="submit"
					disabled={loading}
					className="cursor-pointer w-full h-11 text-white font-semibold rounded-xl bg-[#8B5CF6] disabled:opacity-60"
				>
					{loading ? "로그인 중..." : "로그인"}
				</button>
			</form>

			{message && (
				<p className="text-center text-sm text-[#EF4444] mb-3">
					{message}
				</p>
			)}

			<div className="flex flex-col gap-4 items-center mb-3">
				<div className="text-xs text-[#6B7280]">
					또는 소셜 계정으로 로그인
				</div>
				<button
					type="button"
					className="cursor-pointer w-full h-11 text-white rounded-xl bg-[#4285F4] font-medium"
					onClick={handleGoogleLogin}
				>
					Google 로그인
				</button>
				<button
					type="button"
					className="cursor-pointer w-full h-11 rounded-xl bg-[#FEE500] font-medium"
					onClick={handleKakaoLogin}
				>
					Kakao 로그인
				</button>
				<button
					type="button"
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
