import { Link } from "react-router";
import { socialSignIn } from "../../utils/useSocialAuth";

export default function RegisterPage() {
	// const navigate = useNavigate();

	return (
		<>
			<h1 className="text-[28px] font-black mb-6 text-[#8b5cf6] text-center">
				회원가입
			</h1>

			<div className="flex flex-col gap-4 items-center justify-center">
				<Link
					to="/registerEmail"
					className="w-full h-11 rounded-xl font-bold text-white flex items-center justify-center bg-[#8b5cf6] hover:bg-violet-600 active:bg-violet-700"
				>
					이메일로 가입하기
				</Link>

				<div className=" text-center text-slate-500 text-xs">
					또는 소셜 계정으로 <strong>회원가입</strong>
				</div>

				{/* 버튼 컴포넌트 할 예정 */}
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
					<span>Google로 가입하기</span>
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

					<span className="">카카오로 시작하기</span>
				</button>

				<Link
					to="/login"
					className="text-[#8B5CF6] text-sm hover:underline"
				>
					이미 계정이 있나요? <strong>로그인</strong>
				</Link>
			</div>
		</>
	);
}
