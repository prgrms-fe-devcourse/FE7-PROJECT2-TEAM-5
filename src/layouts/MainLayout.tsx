import { Outlet } from "react-router";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function MainLayout() {
	return (
		<>
			<div className="min-h-screen flex flex-col">
				{/* 헤더 영역 */}
				<Header />
				{/* 메인 + footer */}
				<div className="flex-1 flex w-[1440px] mx-auto">
					<main className="flex-1 overflow-auto p-5">
						<Outlet />
					</main>
					<Footer />
				</div>
			</div>
		</>
	);
}
