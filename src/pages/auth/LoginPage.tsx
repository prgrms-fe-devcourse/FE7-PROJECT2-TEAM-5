import supabase from "../../utils/supabase";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { socialSignIn } from "../../utils/useSocialAuth";

export default function LoginPage() {
	const navigate = useNavigate();

	// 입력 상태
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	// 개별 에러 메시지 상태 관리
	const [errors, setErrors] = useState<{ email?: string; password?: string }>(
		{},
	);

	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setErrors({}); // 기존 에러 초기화

		try {
			// 입력값 검증
			if (!email) {
				setErrors({ email: "이메일을 입력해주세요" });
				setLoading(false);
				return;
			}
			if (!password) {
				setErrors({ password: "비밀번호를 입력해주세요" });
				setLoading(false);
				return;
			}

			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				console.log(error);

				// 이메일 혹은 비밀번호 틀림
				if (error.message.includes("Invalid login credentials")) {
					setErrors({
						email: "이메일을 확인해주세요",
						password: "비밀번호를 확인해주세요",
					});
				} else {
					setErrors({ email: "로그인 중 오류가 발생했습니다." });
				}
				return;
			}

			if (data?.user) {
				navigate("/");
			}
		} catch (err) {
			console.error(err);
			setErrors({ email: "예상치 못한 오류가 발생했습니다." });
		} finally {
			setLoading(false);
		}
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
				<div>
					<input
						id="login-email"
						type="email"
						placeholder="이메일"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={`w-full h-11 rounded-xl border px-4 outline-none ${
							errors.email
								? "border-[#EF4444]"
								: "border-[#D1D5DB]"
						}`}
					/>
					{errors.email && (
						<p className="text-xs text-[#EF4444] mt-1">
							{errors.email}
						</p>
					)}
				</div>

				<div>
					<input
						id="login-password"
						type="password"
						placeholder="비밀번호"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={`w-full h-11 rounded-xl border px-4 outline-none ${
							errors.password
								? "border-[#EF4444]"
								: "border-[#D1D5DB]"
						}`}
					/>
					{errors.password && (
						<p className="text-xs text-[#EF4444] mt-1">
							{errors.password}
						</p>
					)}
				</div>

				<button
					type="submit"
					disabled={loading}
					className="cursor-pointer w-full h-11 text-white font-semibold rounded-xl bg-[#8B5CF6] disabled:opacity-60"
				>
					{loading ? "로그인 중" : "로그인"}
				</button>
			</form>

			<div className="flex flex-col gap-4 items-center mb-3">
				<div className="text-xs text-[#6B7280]">
					또는 소셜 계정으로 로그인
				</div>
				<button
					type="button"
					className="cursor-pointer w-full h-11 text-white rounded-xl bg-[#4285F4] font-medium"
				>
					Google 로그인
				</button>
				<button
					type="button"
					className="cursor-pointer w-full h-11 rounded-xl bg-[#FEE500] font-medium"
					onClick={() => socialSignIn("kakao")}
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
