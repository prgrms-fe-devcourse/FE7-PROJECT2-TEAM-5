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
import PostSearchPage from "./pages/post/PostSearchPage";

export default function App() {
	return (
		<>
			<Routes>
				<Route element={<MainLayout />}>
					<Route index element={<HomePage />} />
					<Route path="read/:id" element={<PostListPage />} />
					<Route path="profile/:id" element={<ProfilePage />} />
					<Route path="msg/:id" element={<DmPage />} />
					<Route path="search" element={<PostSearchPage />} />
				</Route>
				<Route element={<AuthLayout />}>
					<Route index path="login" element={<LoginPage />} />
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
