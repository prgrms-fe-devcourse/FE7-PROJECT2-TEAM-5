import { Route, Routes, useLocation } from "react-router";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterEmailPage from "./pages/auth/RegisterEmailPage";
import DmPage from "./pages/dm/DmPage";
import ProfilePage from "./pages/profile/ProfilePage";
import PostListPage from "./pages/post/PostListPage";
import SearchPage from "./pages/search/SearchPage";
import EditProfile from "./pages/profile/EditProfile";
import PostDetailPage from "./pages/post/PostDetailPage";
import GroupPage from "./pages/group/GroupPage";
import CreateGroup from "./pages/group/CreateGroup";
import PostCreatePage from "./pages/post/PostCreatePage";
import { useProfileStore } from "./stores/profileStore";
import { useEffect } from "react";
import supabase from "./utils/supabase";
import GroupPostListPage from "./pages/group/GroupPostListPage";
import GroupPostDetailPage from "./pages/group/GroupPostDetailPage";
import GroupAttendancePage from "./pages/group/GroupAttendance";
import GroupPostCreatePage from "./pages/group/GroupPostCreatePage";
import SocialSignupInfo from "./pages/auth/SocialSignupInfo";
import { useCheckProfileCompleted } from "./hooks/useCheckProfileCompleted";
import { useSetOnlineStatus } from "./hooks/useSetOnlineStatus";
import NotFoundPage from "./layouts/NotFoundPage";

export default function App() {
	// 프로필 완성 여부 확인 훅
	useCheckProfileCompleted();

	// 유저
	const { currentUserId, fetchProfile } = useProfileStore();
	const location = useLocation();

	useSetOnlineStatus(currentUserId || "");

	useEffect(() => {
		const initAuth = async () => {
			const { data } = await supabase.auth.getSession();
			const user = data.session?.user;

			// 로그인 유저 정보 세팅
			if (user) {
				useProfileStore.setState((state) => {
					state.currentUserId = user.id;
					state.isLoggedIn = true;
				});
			}

			// 현재 경로가 프로필 페이지인지 확인
			const pathMatch = location.pathname.match(/^\/profile\/([^/]+)/);
			if (pathMatch) {
				const targetId = pathMatch[1];
				// "me" 처리: 내 프로필이면 로그인 유저 ID 사용
				if (targetId === "me" && user) {
					await fetchProfile(user.id);
				} else {
					await fetchProfile(targetId);
				}
			} else if (user) {
				// 홈이나 다른 페이지에서는 로그인 유저 프로필 fetch
				await fetchProfile(user.id);
			}
		};

		initAuth();
	}, [fetchProfile, location.pathname]);

	return (
		<>
			<Routes>
				{/* Main */}
				<Route element={<MainLayout />}>
					<Route index element={<HomePage />} />

					{/* Profile */}
					<Route path="profile/:id" element={<ProfilePage />} />
					<Route path="profile/me/edit" element={<EditProfile />} />

					{/* Group */}
					<Route path="groups">
						<Route index element={<GroupPage />} />
						<Route path="create" element={<CreateGroup />} />
						<Route path=":groupId">
							<Route path="posts">
								<Route index element={<GroupPostListPage />} />
								<Route
									path=":postId"
									element={<GroupPostDetailPage />}
								/>
								<Route
									path="create"
									element={<GroupPostCreatePage />}
								/>
							</Route>
							<Route
								path="attendance"
								element={<GroupAttendancePage />}
							/>
						</Route>
					</Route>

					{/* Post */}
					<Route path="posts">
						<Route index element={<PostListPage />} />
						<Route path=":id" element={<PostDetailPage />} />
						<Route path="create" element={<PostCreatePage />}>
							<Route path=":id" element={<PostCreatePage />} />
						</Route>
					</Route>

					{/* DM */}
					<Route path="msg" element={<DmPage />} />
					<Route path="msg/:id" element={<DmPage />} />

					{/* Search */}
					<Route path="search" element={<SearchPage />} />
				</Route>

				{/* Auth */}
				<Route element={<AuthLayout />}>
					{/* Login */}
					<Route index path="login" element={<LoginPage />} />

					{/* Register */}
					<Route path="register">
						<Route index element={<RegisterPage />}></Route>
						<Route
							path="socialSignup"
							element={<SocialSignupInfo />}
						></Route>
					</Route>
					<Route
						path="registerEmail"
						element={<RegisterEmailPage />}
					/>
				</Route>

				{/* 404 Page */}
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</>
	);
}
