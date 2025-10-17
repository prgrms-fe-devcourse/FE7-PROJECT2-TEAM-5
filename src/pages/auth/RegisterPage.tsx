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
					className="w-full h-11 rounded-xl bg-[#4285F4] hover:bg-blue-600 active:bg-blue-700
						text-white font-medium"
				>
					Google로 가입하기
				</button>

				<button
					type="button"
					className="w-full h-11 rounded-xl bg-[#FEE500] hover:bg-yellow-400 active:bg-yellow-500
            text-black font-medium"
					onClick={() => socialSignIn("kakao")}
				>
					Kakao로 가입하기
				</button>

				<button
					type="button"
					className="w-full h-11 rounded-xl bg-[#03C75A] hover:bg-green-600 active:bg-green-800
						text-white font-medium"
				>
					Naver로 가입하기
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
