export default function Sidebar() {
  return (
    <>
      <aside className="w-[290px] p-5 border-r border-[#E6E9EE]">
        {/* 프로필 */}
        <div className="flex flex-col items-center">
          {/* 프로필 사진(기본 이미지) */}
          <img
            src="/src/assets/image.png"
            alt="MyProfile"
            className="w-25 h-25 rounded-full mx-auto mb-[10px]"
          />
          {/* 닉네임 */}
          <h2 className="text-xl font-medium mb-[15px]">닉네임</h2>
          {/* 닉네임 아래 박스 */}
          <div className="w-[250px] h-16 bg-[#F7FAFC] rounded-lg flex items-center justify-center font-medium text-[18px] text-[#6B7280]">
            로그인 후 확인 가능
          </div>
        </div>
        {/* 전체 게시판 */}
        <div>
          {/* 제목 */}
          <div>
            <h3>전체 게시판</h3>
          </div>
          {/* 내용 */}
          {/* 게시판 맵핑해서 맵으로 돌릴 예정 div -> Link로 수정 */}
          <div>
            <div>자유 게시판</div>
            <div>초등학생</div>
            <div>중학생</div>
            <div>고등학생</div>
            <div>스터디 그룹</div>
          </div>
        </div>
        {/* 선생님 게시판 */}
        <div>
          {/* 제목 */}
          <div>
            <h3>선생님 게시판</h3>
          </div>
          {/* 내용 */}
          {/* 게시판 맵핑해서 맵으로 돌릴 예정 div -> Link로 수정 */}
          <div>
            <div>수업 자료 공유</div>
          </div>
        </div>
        {/* 실시간 접속 */}
        <div>
          {/* 제목 */}
          <div>
            <h3>실시간 접속</h3>
          </div>
          {/* 내용 */}
          <div>
            {/* 내용 inner */}
            <div>
              {/* 접속자 */}
              <div>
                <img src="/src/assets/image.png" alt="Profile" />
                <h4>고길동</h4>
                <span>초등학교 6학년</span>
              </div>
              <div>
                <img src="/src/assets/image.png" alt="Profile" />
                <h4>노길동</h4>
                <span>중학교 3학년</span>
              </div>
              <div>
                <img src="/src/assets/image.png" alt="Profile" />
                <h4>도길동</h4>
                <span>초등학교 4학년</span>
              </div>
              <div>
                <img src="/src/assets/image.png" alt="Profile" />
                <h4>오길동</h4>
                <span>고등학교 2학년</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
