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
import SearchPage from "./pages/SearchPage";
import ModifyProfile from "./pages/profile/EditProfile";
import PostDetailPage from "./pages/post/PostDetailPage";
import GroupPage from "./pages/group/GroupPage"; 
import CreateGroup from "./pages/group/CreateGroup"

export default function App() {
	return (
		<>
			<Routes>
				{/* Main */}
				<Route element={<MainLayout />}>
					<Route index element={<HomePage />} />

					{/* Profile */}
					<Route path="profile/:id" element={<ProfilePage />} />
					<Route
						path="profile/:id/edit"
						element={<ModifyProfile />}
					/>

                {/* Group */}
                <Route path="groups" element={<GroupPage />} />
				 <Route path="groups/create" element={<CreateGroup />} />
					{/* Post */}
					<Route path="postList" element={<PostListPage />} />
					<Route path="post/:id" element={<PostDetailPage />} />

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
