import { Link } from "react-router";

export default function AuthLayout() {
  return (
    <>
      {/* 전체 */}
      <div>
        {/* 컨텐츠 */}
        <div>
          {/* Left */}
          <div>
            {/* Top */}
            <div>
              {/* 로고 */}
              <div></div>
              {/* 텍스트 */}
              <div>StudyHub</div>
              <div>학생·선생님·학부모가 함께하는 학습 커뮤니티</div>
            </div>
            {/* Middle */}
            <div>
              <div>환영합니다 - 다시 시작해 볼까요?</div>
              <div>
                문제 풀이, 스터디, 피드백을 한 곳에서!
                <br />
                계정으로 로그인하여 학습 활동을 이어가세요.
              </div>
            </div>
            {/* Bottom */}
            <div>
              {/* 태그 */}
              <div>오답 노트</div>
              <div>스터디 그룹</div>
              <div>실시간 DM</div>
              <div>역할 기반 피드</div>
            </div>
          </div>
          {/* Right */}
          <div>
            {/* 텍스트 */}
            <div></div>
            {/* 로그인 */}
            <form>
              {/* 아이디 */}
              <label>
                아이디
                <input type="text" placeholder="아이디를 입력하세요" />
              </label>

              {/* 비밀번호 */}
              <label>
                비밀번호
                <input type="password" placeholder="비밀번호를 입력하세요" />
              </label>

              {/* 제출 버튼 */}
              <button type="submit">
                <Link to="/">로그인</Link>
              </button>
            </form>
            {/* 회원가입 이동 */}
            <Link to="/register">회원가입</Link>
          </div>
        </div>
      </div>
    </>
  );
}
