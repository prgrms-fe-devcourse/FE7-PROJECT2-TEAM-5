# 오픈 API를 활용한 검색 웹 사이트 제작 프로젝트 - TEAM05 오리곰탕

이 프로젝트는 React 기반의 SPA로 제작되는 검색 기능 중심의 소셜 네트워크 서비스입니다.

사용자는 회원가입·로그인 후 포스트 작성, 검색, 좋아요, 댓글, 알림 확인 등을 할 수 있으며, 반응형 웹과 무한 스크롤을 지원합니다.

API는 Supabase를 활용하여 구현합니다.

# 목표

- 오픈 API 연동 및 활용 능력 강화
- 소셜 네트워크 핵심 기능 구현
- 반응형 UI/UX 제공
- 확장 기능(다크 모드, 파일 업로드, 메시징) 적용

# 실행 방법

```
npm install
npm run dev
```

# 폴더 구조

```
src/
 ├─ assets/              # 이미지, 아이콘, 글로벌 스타일 등
 │   ├─ basic_image.png
 │   ├─ fire.png
 │   ├─ Heart.png
 │   ├─ image.png
 │   ├─ SpeechBubble.png
 │   └─ Toggle.png
 │
 ├─ components/          # 재사용 가능한 UI 컴포넌트
 │   ├─ layout/
 │   │   ├─ Footer.tsx
 │   │   └─ Header.tsx
 │   ├─ loading/         # 스켈레톤 로딩 컴포넌트
 │   │   ├─ group/
 │   │   │   ├─ GroupAttendanceSkeleton.tsx
 │   │   │   ├─ GroupMemberSkeleton.tsx
 │   │   │   └─ GroupPageCardSkeleton.tsx
 │   │   ├─ home/
 │   │   │   └─ HomePageSkeleton.tsx
 │   │   ├─ message/
 │   │   │   ├─ ChatRoomListSkeleton.tsx
 │   │   │   └─ MessageListSkeleton.tsx
 │   │   ├─ NotificationSkeleton.tsx
 │   │   ├─ PointHistorySkeleton.tsx
 │   │   ├─ post/
 │   │   │   ├─ PostDetailSkeleton.tsx
 │   │   │   └─ PostListSkeleton.tsx
 │   │   └─ profile/
 │   │       ├─ DetailCardSkeleton.tsx
 │   │       ├─ EditProfileSkeleton.tsx
 │   │       └─ ProfileCadeSkeleton.tsx
 │   ├─ message/         # 메시지 관련 컴포넌트
 │   │   ├─ ChatRoomItem.tsx
 │   │   ├─ ChatRoomList.tsx
 │   │   ├─ MessageBubble.tsx
 │   │   └─ MessageList.tsx
 │   ├─ Button.tsx
 │   ├─ FileUpload.tsx
 │   ├─ FormErrorMessage.tsx
 │   ├─ Input.tsx
 │   ├─ InputFile.tsx
 │   ├─ MemberCard.tsx
 │   ├─ Modal.tsx
 │   ├─ NotificationSidebar.tsx
 │   ├─ PageNation.tsx
 │   ├─ PointHistoryModal.tsx
 │   ├─ PostList.tsx
 │   ├─ PostTabContainer.tsx
 │   ├─ RoleBadge.tsx
 │   ├─ UserList.tsx
 │   └─ UserListCard.tsx
 │
 ├─ css/                 # 스타일 파일
 │   ├─ index.css
 │   └─ tailwind.css
 │
 ├─ hooks/               # 커스텀 훅
 │   ├─ useBadgeHook.ts
 │   ├─ useCheckProfileCompleted.ts
 │   ├─ useMessages.ts
 │   ├─ useNotifications.ts
 │   ├─ useOnlineUsers.ts
 │   ├─ useSetOnlineStatus.ts
 │   └─ useUnreadMessages.ts
 │
 ├─ layouts/             # 페이지 레이아웃 (공통 구조)
 │   ├─ AuthLayout.tsx   # 로그인/회원가입 전용
 │   ├─ MainLayout.tsx   # Header + Sidebar + Content
 │   └─ NotFoundPage.tsx
 │
 ├─ pages/               # 페이지 단위
 │   ├─ auth/            # 로그인/회원가입
 │   │   ├─ LoginPage.tsx
 │   │   ├─ RegisterEmailPage.tsx
 │   │   ├─ RegisterPage.tsx
 │   │   └─ SocialSignupInfo.tsx
 │   ├─ dm/              # DM
 │   │   └─ DmPage.tsx
 │   ├─ group/           # 그룹 관련 페이지
 │   │   ├─ CreateGroup.tsx
 │   │   ├─ GroupAttendance.tsx
 │   │   ├─ GroupCard.tsx
 │   │   ├─ GroupMembers.tsx
 │   │   ├─ GroupPage.tsx
 │   │   ├─ GroupPostComments.tsx
 │   │   ├─ GroupPostCreatePage.tsx
 │   │   ├─ GroupPostDetailPage.tsx
 │   │   └─ GroupPostListPage.tsx
 │   ├─ home/            # 홈
 │   │   └─ HomePage.tsx
 │   ├─ post/            # 게시글
 │   │   ├─ PostComments.tsx
 │   │   ├─ PostCreatePage.tsx
 │   │   ├─ PostDetailPage.tsx
 │   │   └─ PostListPage.tsx
 │   ├─ profile/         # 프로필 페이지
 │   │   ├─ Activities.tsx
 │   │   ├─ ActivitiesComments.tsx
 │   │   ├─ ActivitiesPosts.tsx
 │   │   ├─ ActivitiesTab.tsx
 │   │   ├─ DetailCard.tsx
 │   │   ├─ EditProfile.tsx
 │   │   ├─ Friends.tsx
 │   │   ├─ Info.tsx
 │   │   ├─ InfoBlock.tsx
 │   │   ├─ ProfileCard.tsx
 │   │   ├─ ProfilePage.tsx
 │   │   └─ TabContainer.tsx
 │   └─ search/          # 검색
 │       └─ SearchPage.tsx
 │
 ├─ stores/              # Zustand 전역 상태 관리
 │   ├─ badgeStore.ts
 │   ├─ groupStore.ts
 │   ├─ memberStore.ts
 │   ├─ notificationStore.ts
 │   ├─ postsStore.ts
 │   ├─ postStore.ts
 │   ├─ profileActivityStore.ts
 │   ├─ profileStore.ts
 │   └─ userListStore.ts
 │
 ├─ types/               # 전역 타입 정의
 │   ├─ auth.d.ts
 │   ├─ badge.d.ts
 │   ├─ comment.d.ts
 │   ├─ database.d.ts
 │   ├─ file.d.ts
 │   ├─ friend.d.ts
 │   ├─ message.d.ts
 │   ├─ notification.d.ts
 │   ├─ post.d.ts
 │   ├─ profile.d.ts
 │   └─ user.d.ts
 │
 ├─ utils/               # 유틸 함수
 │   ├─ ageToBirthDate.ts
 │   ├─ authValidation.ts
 │   ├─ codeToEmoji.ts
 │   ├─ fileDownload.ts
 │   ├─ fileUpload.ts
 │   ├─ getAge.ts
 │   ├─ getGrade.ts
 │   ├─ groupActivity.ts
 │   ├─ messageUtils.ts
 │   ├─ pointUtils.ts
 │   ├─ supabase.ts
 │   ├─ timeAgoIntl.ts
 │   └─ useSocialAuth.ts
 │
 ├─ App.tsx              # 라우팅 설정
 └─ main.tsx             # React 엔트리 포인트

```

### 디렉터리 가이드

- **assets/**
    - 이미지, 아이콘, 글로벌 스타일(CSS, 폰트 등) 관리
    - 프로젝트에서 사용하는 모든 정적 자원들

- **components/**
    - 재사용 가능한 UI 컴포넌트 모음
    - layout/: Header, Footer 등 레이아웃 단위 컴포넌트
    - loading/: 스켈레톤 로딩 컴포넌트들 (group, home, message, post, profile)
    - message/: 메시지 관련 컴포넌트들 (채팅방, 메시지 버블 등)

- **css/**
    - 스타일 파일 관리
    - Tailwind CSS 설정 및 글로벌 스타일

- **hooks/**
    - 커스텀 훅 모음
    - 배지, 메시지, 알림, 온라인 상태 등 다양한 기능별 훅

- **layouts/**
    - 페이지 레이아웃 정의
    - AuthLayout.tsx: 로그인/회원가입 전용
    - MainLayout.tsx: 공통 구조 (Header + Sidebar + Content)
    - NotFoundPage.tsx: 404 페이지

- **pages/**
    - 라우팅되는 페이지 단위 컴포넌트
    - auth/: 로그인, 회원가입, 소셜 회원가입 정보 입력
    - dm/: DM 페이지
    - group/: 그룹 관련 페이지 (생성, 출석, 멤버, 포스트 등)
    - home/: 홈 화면
    - post/: 게시글 관련 (리스트, 작성, 상세, 댓글)
    - profile/: 프로필 페이지 (활동, 친구, 정보, 편집 등)
    - search/: 검색 페이지

- **stores/**
    - Zustand 기반 전역 상태 관리
    - 배지, 그룹, 멤버, 알림, 포스트, 프로필 등 기능별 스토어

- **types/**
    - 전역 타입 정의
    - 인증, 배지, 댓글, 데이터베이스, 파일, 친구, 메시지, 알림, 포스트, 프로필, 사용자 등

- **utils/**
    - 공통 유틸 함수
    - 날짜 변환, 인증 검증, 파일 업로드/다운로드, 포인트 관리, 메시지 유틸 등

- **App.tsx**
    - 라우팅 및 전역 레이아웃 설정

- **main.tsx**
    - React 엔트리 포인트 (앱 초기화)

# 커밋 메시지 컨벤션

<타입>: <짧은 설명> (선택: #이슈번호)

### <타입>

1. feat: 새로운 기능 추가
2. fix: 버그 수정
3. docs: 문서 수정
4. style: 코드 스타일 변경(추가)
5. refactor: 리펙토링
6. test: 테스트 코드 추가
7. chore: 빌드 설정 변경

# PR 규칙

PR 제목: [feat/edit] ..., [feat/src] ...

# 기능

# API

API 정리해서 작성

## 주요 라이브러리

1. **Zustand + Immer**
    - 상태 관리를 위해 사용
    - Immer를 통해 불변성을 쉽게 관리

2. **Tailwind CSS**
    - 유틸리티 클래스 기반 CSS 프레임워크

3. **React Router**
    - SPA 라우팅을 위해 사용

4. **Prettier, ESLint**
    - 코드 스타일 통일을 위해 사용

5. **Supabase (Auth, DB, Storage, Realtime)**
    - 데이터베이스, 인증, 실시간 기능을 위해 사용

6. **Lucide React**
    - 아이콘 라이브러리로 사용
    - 일관된 UI 디자인을 위해 사용
