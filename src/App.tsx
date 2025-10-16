import { Route, Routes } from "react-router";
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
import GroupAttendancePage from "./pages/group/GroupAttendancePage";

export default function App() {
	const fetchProfile = useProfileStore((state) => state.fetchProfile);

	useEffect(() => {
		const initAuth = async () => {
			// OAuth 후 리다이렉트 시 토큰 처리
			const { data, error } = await supabase.auth.getSession(); // 현재 세션 확인
			if (error) {
				console.error("getSession error", error);
				return;
			}

			const user = data.session?.user;

			console.log(user);
			if (user) {
				// 로그인 상태라면 store 업데이트
				fetchProfile(user.id);
			}
		};

		initAuth();
	}, [fetchProfile]);

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
					<Route path="groups/create" element={<CreateGroup />} />
					<Route path="groups" element={<GroupPage />} />
					<Route
						path="groups/postList"
						element={<GroupPostListPage />}
					/>
					<Route
						path="groups/post/:id"
						element={<GroupPostDetailPage />}
					/>
					<Route
						path="groups/attendance"
						element={<GroupAttendancePage />}
					/>

					{/* Post */}
					<Route path="postList" element={<PostListPage />} />
					<Route path="post/:id" element={<PostDetailPage />} />
					<Route path="postList/edit" element={<PostCreatePage />} />

					{/* DM */}
					<Route path="msg/:id" element={<DmPage />} />

					{/* Search */}
					<Route path="search" element={<SearchPage />} />
				</Route>

				{/* Auth */}
				<Route element={<AuthLayout />}>
					{/* Login */}
					<Route index path="login" element={<LoginPage />} />

					{/* Register */}
					<Route path="register" element={<RegisterPage />} />
					<Route
						path="registerEmail"
						element={<RegisterEmailPage />}
					/>
				</Route>
			</Routes>
		</>
	);
}
