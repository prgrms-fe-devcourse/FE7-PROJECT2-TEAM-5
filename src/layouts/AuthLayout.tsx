import { Outlet } from "react-router";

export default function AuthLayout() {
	return (
		<>
			<div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
				<div className="rounded-xl bg-white p-10 w-[400px] shadow-[0_12px_24px_rgba(0,0,0,0.1)]">
					<Outlet />
				</div>
			</div>
		</>
	);
}
