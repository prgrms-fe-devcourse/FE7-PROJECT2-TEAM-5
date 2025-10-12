import { Outlet } from "react-router";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function MainLayout() {
	return (
		<>
			{/* 전체 레이아웃 */}
			<div className="min-h-screen flex flex-col">
				{/* 헤더 고정 */}
				<Header />

				{/* 스크롤 영역 */}
				<main className="overflow-y-auto bg-[#F3F4F6] flex flex-col items-center h-[calc(100vh-70px)]">
					<div className="min-h-[calc(100%)]">
						<div className="min-h-[calc(100%-90px)] pt-10">
							<Outlet />
						</div>
						<Footer />
					</div>
				</main>
			</div>
		</>
	);
}
