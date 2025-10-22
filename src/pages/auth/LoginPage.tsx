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
					className="cursor-pointer flex flex-row items-center justify-center gap-2 w-full h-11 rounded-xl bg-white border border-[#6B7280] hover:bg-gray-100 text-[#191919]"
					onClick={() => socialSignIn("google")}
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g clip-path="url(#clip0_803_56)">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M14.4 7.66549C14.4 7.1558 14.3542 6.66574 14.2693 6.19531H7.5V8.97555H11.3682C11.2016 9.87399 10.6952 10.6352 9.93394 11.1449V12.9483H12.2568C13.6159 11.697 14.4 9.85443 14.4 7.66549Z"
								fill="#4285F4"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M7.50116 14.6891C9.44179 14.6891 11.0687 14.0454 12.258 12.9477L9.9351 11.1443C9.29148 11.5756 8.46816 11.8304 7.50116 11.8304C5.62913 11.8304 4.04461 10.5661 3.47941 8.86719H1.07812V10.7294C2.2608 13.0784 4.69148 14.6891 7.50116 14.6891Z"
								fill="#34A853"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M3.47827 8.86693C3.33452 8.43568 3.25284 7.97499 3.25284 7.50131C3.25284 7.02756 3.33452 6.56693 3.47827 6.13566V4.27344H1.07699C0.590199 5.24375 0.3125 6.34149 0.3125 7.50131C0.3125 8.66106 0.590199 9.75881 1.07699 10.7291L3.47827 8.86693Z"
								fill="#FBBC05"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M7.50116 3.17116C8.55641 3.17116 9.50385 3.53381 10.2487 4.24603L12.3102 2.18452C11.0655 1.02472 9.43847 0.3125 7.50116 0.3125C4.69148 0.3125 2.2608 1.92316 1.07812 4.27216L3.47941 6.13437C4.04461 4.43551 5.62913 3.17116 7.50116 3.17116Z"
								fill="#EA4335"
							/>
						</g>
						<defs>
							<clipPath id="clip0_803_56">
								<rect width="15" height="15" fill="white" />
							</clipPath>
						</defs>
					</svg>
					<span>Google 로그인</span>
				</button>
				<button
					type="button"
					className="cursor-pointer flex flex-row items-center justify-center gap-2 w-full h-11 rounded-xl bg-[#FEE500] hover:bg-yellow-400 text-[#191919]"
					onClick={() => socialSignIn("kakao")}
				>
					<svg
						width="15"
						height="14"
						viewBox="0 0 15 14"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M7.49461 0C3.34583 0 0 2.70269 0 5.98378C0 8.11355 1.39186 9.97844 3.47966 11.0432L2.77302 13.7082C2.7597 13.7481 2.75766 13.791 2.76711 13.832C2.77657 13.873 2.79714 13.9107 2.82656 13.9406C2.86945 13.9787 2.92463 13.9999 2.98181 14C3.02921 13.9962 3.07419 13.9772 3.11028 13.946L6.15097 11.8758C6.59982 11.9383 7.05227 11.9707 7.50541 11.973C11.6489 11.973 15 9.27032 15 5.98378C15 2.69729 11.6381 0 7.49461 0Z"
							fill="#392020"
						/>
					</svg>

					<span className="">카카오 로그인</span>
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
