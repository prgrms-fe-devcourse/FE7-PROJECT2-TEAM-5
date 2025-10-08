import { Route, Routes } from "react-router";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import HomePage from "./pages/home/HomePage";
import ProfilePage from "./pages/profile/ProfilePage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterEmailPage from "./pages/auth/RegisterEmailPage";

export default function App() {
	return (
		<>
			<Routes>
				<Route element={<MainLayout />}>
					<Route index element={<HomePage />} />
					<Route path="profile" element={<ProfilePage />} />
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
