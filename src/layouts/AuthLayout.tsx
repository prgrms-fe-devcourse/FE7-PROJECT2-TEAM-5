import { Outlet } from "react-router";

export default function AuthLayout() {
	return (
		<>
			<div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
				<Outlet />
			</div>
		</>
	);
}
