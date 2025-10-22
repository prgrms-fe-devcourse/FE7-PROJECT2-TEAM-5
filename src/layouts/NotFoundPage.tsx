import Button from "../components/Button";
import Footer from "../components/layout/Footer";

export default function NotFoundPage() {
	return (
		<>
			<div className="w-screen h-screen flex flex-col items-center justify-center bg-[#F3F4F6]">
				<div className="flex flex-col items-center min-w-[500px] h-auto px-10 py-15 bg-white rounded-2xl shadow-[0_10px_25px_rgba(139,92,246,0.1)]">
					<h2 className="font-extrabold text-[84px] bg-gradient-to-r from-[#8B5CF6] to-[#EA489A] bg-clip-text text-transparent">
						404
					</h2>
					<p className="font-bold text-[28px] bg-gradient-to-r from-[#8B5CF6] to-[#EA489A] bg-clip-text text-transparent">
						페이지를 찾을 수 없습니다
					</p>
					<p className="text-center text-[#6B7280] mt-5">
						요청하신 페이지가 존재하지 않거나, 이동되었을 수
						있습니다.
						<br />
						홈으로 돌아가거나 다른 기능을 이용해보세요.
					</p>
					<div className="space-x-4 mt-10">
						<Button className="px-5 py-3 rounded-xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#EA489A] text-white transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
							홈으로 이동
						</Button>
						<Button className="px-5 py-3 rounded-xl font-bold shadow-[inset_0_0_0_1px_#8B5CF6] text-[#8B5CF6] hover:text-white hover:bg-[#8B5CF6]">
							게시판 보러가기
						</Button>
						<Button className="px-5 py-3 rounded-xl font-bold shadow-[inset_0_0_0_1px_#8B5CF6] text-[#8B5CF6] hover:text-white hover:bg-[#8B5CF6]">
							그룹 보러가기
						</Button>
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
}
