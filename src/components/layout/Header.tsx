import { Link } from "react-router";

export default function Header() {
  return (
    <>
      <header className="w-screen h-[70px] border-b border-[#E6E9EE]">
        {/* 헤더 안에 영역 */}
        <div className="max-w-[1440px] h-[70px] mx-auto px-5">
          <div className="flex h-full items-center justify-between">
            {/* 로고 Link로 변경 예정 */}
            <Link to="/" className="w-[130px] h-10 bg-[#00A9A5]">
              로고
            </Link>
            {/* 검색창 + 버튼 */}
            <nav className="w-[1080px] flex justify-between">
              {/* 검색창 */}
              <form className="relative w-[515px]">
                <input
                  className="w-full h-10 border border-[#E6E9EE] rounded-[20px] pl-[25px] pr-[55px] placeholder-[#E6E9EE] outline-none focus:border-[#E6E9EE]"
                  id="search"
                  type="text"
                  placeholder="게시글, @사용자, #해시태그로 검색"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.6014 18.3943C19.8211 18.6143 19.7291 19.063 19.3956 19.3965C19.0621 19.73 18.6133 19.8221 18.3934 19.6023L12.9949 14.2039C12.775 13.9839 12.8671 13.5352 13.2007 13.2016C13.5343 12.8681 13.983 12.7759 14.2029 12.9959L19.6014 18.3943Z"
                      fill="#E6E9EE"
                    />
                    <circle
                      cx="8.54171"
                      cy="8.54171"
                      r="7.54171"
                      stroke="#E6E9EE"
                      stroke-width="2"
                    />
                  </svg>
                </button>
              </form>
              <div className="flex gap-[10px]">
                {/* 버튼 모음 */}
                <Link
                  to="/register"
                  className="h-[40px] line border border-[#FF9F1C] px-[25px] text-[#FF9F1C] rounded-full cursor-pointer flex items-center justify-center"
                >
                  회원가입
                </Link>
                <Link
                  to="/login"
                  className="h-[40px] px-[25px] bg-[#00A9A5] text-white rounded-[999px] cursor-pointer flex items-center justify-center"
                >
                  로그인
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
