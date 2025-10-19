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
 ├─ components/          # 재사용 가능한 UI 컴포넌트
 │   ├─ layout/
 │   │   ├─ Header.tsx
 │   │   └─ Sidebar.tsx
 │   └─ 추가 예정
 │
 │─ hooks/          # 커스텀 훅
 │   └── useCheckProfileCompleted.tsx
 │
 ├─ pages/               # 페이지 단위
 │   ├─ auth/            # 로그인/회원가입
 │   │   ├─ LoginPage.tsx
 │   │   ├─ RegisterPage.tsx
 │   │   └─ RoleSelectPage.tsx
 │   ├─ home/            # 홈
 │   │   └─ HomePage.tsx
 │   ├─ profile/         # 프로필 페이지
 │   │   └─ ProfilePage.tsx
 │   ├─ post/            # 게시글
 │   │   ├─ PostDetailPage.tsx
 │   │   ├─ PostCreatePage.tsx
 │   │   └─ PostListPage.tsx
 │   └─ dm/              # DM
 │       ├─ DmListPage.tsx
 │       └─ DmDetailPage.tsx
 │
 ├─ layouts/             # 페이지 레이아웃 (공통 구조)
 │   ├─ AuthLayout.tsx   # 로그인/회원가입 전용
 │   └─ MainLayout.tsx   # Header + Sidebar + Content
 │
 ├─ store/               # Zustand 전역 상태 관리
 │   ├─
 │   └─
 │
 ├─ api/                 # Axios API 모듈
 │   ├─
 │   └─
 │
 ├─ utils/               # 유틸 함수 (date-fns, formatter 등)
 ├─ types/               # 전역 타입 정의 (User, Post, Group 등)
 ├─ App.tsx              # 라우팅 설정
 └─ main.tsx

```

### 디렉터리 가이드

- assets/

    이미지, 아이콘, 글로벌 스타일(CSS, 폰트 등) 관리

- components/

    재사용 가능한 UI 컴포넌트 모음
    - layout/: Header, Sidebar 등 레이아웃 단위 컴포넌트

- hooks/

    커스텀 훅

- pages/

    라우팅되는 페이지 단위 컴포넌트
    - auth/: 로그인, 회원가입, 역할 선택

    - home/: 홈 화면

    - profile/: 프로필 페이지

    - post/: 게시글 관련 (리스트, 작성, 상세)

    - dm/: DM 목록 및 상세

- layouts/

    페이지 레이아웃 정의
    - AuthLayout.tsx: 로그인/회원가입 전용

    - MainLayout.tsx: 공통 구조 (Header + Sidebar + Content)

- store/

    Zustand 기반 전역 상태 관리

- api/

    Axios API 모듈 (요청/응답 관리)

- utils/

    공통 유틸 함수 (날짜 포맷, 문자열 처리 등)

- types/

    전역 타입 정의 (User, Post, Group 등)

- App.tsx

    라우팅 및 전역 레이아웃 설정

- main.tsx

    React 엔트리 포인트 (앱 초기화)

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

3. **Axios**
    - API 요청을 위해 사용

4. **React Router**
    - SPA 라우팅을 위해 사용

5. **Prettier**
    - 코드 스타일 통일을 위해 사용

6. **ESLint**
