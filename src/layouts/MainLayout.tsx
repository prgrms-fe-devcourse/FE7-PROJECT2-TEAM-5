import { Outlet } from "react-router";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function MainLayout() {
	return (
		<>
			<div className="min-h-screen flex flex-col">
				{/* 헤더 영역 */}
				<Header />
				{/* 메인 */}
				<main className="flex-1 flex flex-col justify-between items-center overflow-y-auto pb-[30px] bg-[#F3F4F6]">
					<Outlet />
					<Footer />
				</main>
			</div>
		</>
	);
}
