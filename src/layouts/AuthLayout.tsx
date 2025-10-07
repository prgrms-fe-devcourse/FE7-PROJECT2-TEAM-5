import { Link } from "react-router";

export default function AuthLayout() {
  return (
    <>
       
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        {/* 로그인 카드 */}
        <div className="rounded-2xl bg-white p-6 md:p-8 w-full max-w-md
+                 ring-1 ring-slate-200 shadow-2xl">
          <h4 className="text-2xl font-extrabold mb-2 text-violet-500 text-center">로그인</h4>

          <form className="w-full space-y-4">
            <input
              id="login-username"
              type="text"
              placeholder="이메일"
              className="block w-full rounded-lg border border-slate-200 bg-white px-4 py-3
                         outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
            />

            <input
              id="login-password"
              type="password"
              placeholder="비밀번호"
              className="block w-full rounded-lg border border-slate-200 bg-white px-4 py-3
                         outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200"
            />

            <button
              type="submit"
              className="w-full h-10 text-white font-bold rounded-xl mb-5 bg-violet-500"
            >
              <Link to="/">로그인</Link>
            </button>

            <span className="block text-sm text-center">또는 소셜 계정으로 로그인</span>

            <button type="submit" className="block w-full h-10 mb-3 text-white rounded-xl bg-blue-500">
              Google 로그인
            </button>
            <button type="submit" className="block w-full h-10 mb-3 rounded-xl bg-yellow-300 font-bold">
              Kakao 로그인
            </button>
            <button type="submit" className="block w-full h-10 text-white rounded-xl mb-3 bg-green-600 font-bold">
              Naver 로그인
            </button>

            <span className="block text-sm text-center">
              <Link to="/register">계정이 없나요? 회원가입</Link>
            </span>
          </form>
        </div>
      </div>
    </>
  );
}
