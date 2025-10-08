import { Link } from "react-router";

export default function RegisterPage() {
	return (
		<>
			<div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
				<div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-xl p-6 md:p-8 w-full max-w-md">
					<h1 className="text-3xl font-extrabold text-violet-500 text-center">
						회원가입
					</h1>

					<div className="mt-8 space-y-3">
						<Link
							to="/"
							className="w-full h-12 rounded-lg bg-violet-500 hover:bg-violet-600 active:bg-violet-700
                         text-white font-semibold grid place-items-center"
						>
							이메일로 가입하기
						</Link>

						<p className="text-center text-slate-500 text-sm">
							또는 소셜 계정으로{" "}
							<span className="font-semibold text-slate-600">
								회원가입
							</span>
						</p>

						<button
							type="button"
							className="w-full h-12 rounded-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-700
                         text-white font-semibold"
						>
							Google로 가입하기
						</button>

						<button
							type="button"
							className="w-full h-12 rounded-lg bg-yellow-300 hover:bg-yellow-400 active:bg-yellow-500
                         text-black font-semibold"
						>
							Kakao로 가입하기
						</button>

						<button
							type="button"
							className="w-full h-12 rounded-lg bg-green-600 hover:bg-green-700 active:bg-green-800
                         text-white font-semibold"
						>
							Naver로 가입하기
						</button>
					</div>

					<p className="mt-8 text-center text-slate-500">
						이미 계정이 있나요?{" "}
						<Link
							to="/login"
							className="text-violet-600 font-semibold hover:underline"
						>
							로그인
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
