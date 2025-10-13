import { Link } from "react-router";

// 게시글 리스트 페이지
import { Heart, MessageSquare } from "lucide-react";
// import PageNation from "../../components/PageNation";
export default function PostListPage() {
	return (
		<>
			<div className="w-[920px]">
				<h1 className="font-bold text-[28px] my-3">게시판</h1>
				{/*버튼 */}
				<div className="flex py-1 justify-between">
					{/* 게시판 이동 버튼 */}
					<div className="inline-flex gap-2">
						<button
							type="button"
							className="px-4 py-2 rounded-xl bg-[#8B5CF6]
						text-white font-Regular text-xs hover:bg-[#8B5CF6] hover:text-white cursor-pointer"
						>
							전체 게시판
						</button>
						<button
							type="button"
							className="px-4 py-2 rounded-xl bg-[#ffffff]
						text-black font-Regular text-xs hover:bg-[#8B5CF6] hover:text-white cursor-pointer"
						>
							자유 게시판
						</button>
						<button
							type="button"
							className="px-4 py-2  rounded-xl bg-[#ffffff]
						text-black font-Regular text-xs hover:bg-[#8B5CF6] hover:text-white cursor-pointer"
						>
							초등학생 게시판
						</button>
						<button
							type="button"
							className="px-4 py-2  rounded-xl bg-[#ffffff]
						text-black font-Regular text-xs hover:bg-[#8B5CF6] hover:text-white cursor-pointer"
						>
							중학생 게시판
						</button>
						<button
							type="button"
							className="px-4 py-2 rounded-xl bg-[#ffffff]
						text-black font-Regular text-xs hover:bg-[#8B5CF6] hover:text-white cursor-pointer"
						>
							고등학생 게시판
						</button>
						<button
							type="button"
							className="px-4 py-2 rounded-xl bg-[#ffffff]
						text-black font-Regular text-xs hover:bg-[#8B5CF6] hover:text-white cursor-pointer"
						>
							자료 공유 게시판
						</button>
					</div>
					{/* 글 작성 버튼 */}
					<div className="inline-flex gap-2">
						<button
							type="button"
							className="px-5 py-2 rounded-xl bg-[#8B5CF6]
						text-white font-Regular text-xs hover:bg-[#B08DFF] hover:text-white cursor-pointer"
						>
							검색
						</button>
						<Link
						to="edit"
						className="px-5 py-2 rounded-xl bg-[#8B5CF6]
						text-white font-Regular text-xs hover:bg-[#B08DFF] hover:text-white cursor-pointer"
					>
						새 글 작성
					</Link>
					</div>
				</div>

				{/* 게시판 영역 */}
				<div className="mt-7">
					{/* 글 1 */}
					<div className="w-full mb-4 px-6 py-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] cursor-pointer">
						{/* 글 제목과 좋아요, 댓글 수 */}
						<div className="flex justify-between items-start mb-1">
							<h2 className=" text-[18px] font-bold text-[#8B5CF6]">
								미적분 아주 쉽게 이해하기
							</h2>
							{/* 좋아요, 댓글 수 */}
							<div className="flex gap-3 ">
								{/* 좋아요 개수 표시*/}
								<div className="flex gap-1 items-top ">
									<Heart
										color="red"
										size={15}
										className="mt-0.5"
									/>
									<p className="text-[14px] ">2</p>
								</div>
								{/* 댓글 개수 표시 */}
								<div className="flex gap-1 items-top">
									<MessageSquare
										color="#8B5CF6"
										size={15}
										className="mt-0.5"
									/>
									<p className="text-[14px]">3</p>
								</div>
							</div>
						</div>
						{/* 게시글 내용 */}
						<p className="text-xs font-Regular text-[#6B7280]">
							안녕하세요 수학zl존 입니다 ^^ 오늘은 9등급도 이해할
							수 있는 미적분...
						</p>
						{/* 작성자 이름 */}
						<p className="mt-3 mb-6 text-[14px] font-Regular text-[#1F2937]">
							홍길동
						</p>
						{/* 해시태그 */}
						<div className="flex justify-between items-end">
							<div className="flex gap-2">
								<div
									className="px-4 py-2 rounded-lg bg-[#EA489A]
                        text-white font-Regular text-xs"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-lg bg-[#EA489A]
                        text-white font-Regular text-xs"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-lg bg-[#EA489A]
                        text-white font-Regular text-xs"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-lg bg-[#EA489A]
                        text-white font-Regular text-xs"
								>
									#해시태그
								</div>
							</div>
							<p className="text-[14px] text-[#6B7280]">
								2025-10-10
							</p>
						</div>
					</div>
					{/* 글 2 */}
					<div className="w-full mb-4 px-6 py-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] cursor-pointer">
						{/* 글 제목과 좋아요, 댓글 수 */}
						<div className="flex justify-between items-start mb-1">
							<h2 className=" text-[18px] font-bold text-[#8B5CF6]">
								미적분 아주 쉽게 이해하기
							</h2>
							{/* 좋아요, 댓글 수 */}
							<div className="flex gap-3 ">
								{/* 좋아요 개수 표시*/}
								<div className="flex gap-1 items-top ">
									<Heart
										color="red"
										size={15}
										className="mt-0.5"
									/>
									<p className="text-[14px] ">2</p>
								</div>
								{/* 댓글 개수 표시 */}
								<div className="flex gap-1 items-top">
									<MessageSquare
										color="#8B5CF6"
										size={15}
										className="mt-0.5"
									/>
									<p className="text-[14px]">3</p>
								</div>
							</div>
						</div>
						{/* 게시글 내용 */}
						<p className="text-xs font-Regular text-[#6B7280]">
							안녕하세요 수학zl존 입니다 ^^ 오늘은 9등급도 이해할
							수 있는 미적분...
						</p>
						{/* 작성자 이름 */}
						<p className="mt-3 mb-6 text-[14px] font-Regular text-[#1F2937]">
							홍길동
						</p>
						{/* 해시태그 */}
						<div className="flex justify-between items-end">
							<div className="flex gap-2">
								<div
									className="px-4 py-2 rounded-lg bg-[#EA489A]
                        text-white font-Regular text-xs"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-lg bg-[#EA489A]
                        text-white font-Regular text-xs"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-lg bg-[#EA489A]
                        text-white font-Regular text-xs"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-lg bg-[#EA489A]
                        text-white font-Regular text-xs"
								>
									#해시태그
								</div>
							</div>
							<p className="text-[14px] text-[#6B7280]">
								2025-10-10
							</p>
						</div>
					</div>
					{/* 글 3 */}
					<div className="w-full mb-4 px-6 py-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] cursor-pointer">
						{/* 글 제목과 좋아요, 댓글 수 */}
						<div className="flex justify-between items-start mb-1">
							<h2 className=" text-[18px] font-bold text-[#8B5CF6]">
								미적분 아주 쉽게 이해하기
							</h2>
							{/* 좋아요, 댓글 수 */}
							<div className="flex gap-3 ">
								{/* 좋아요 개수 표시*/}
								<div className="flex gap-1 items-top ">
									<Heart
										color="red"
										size={15}
										className="mt-0.5"
									/>
									<p className="text-[14px] ">2</p>
								</div>
								{/* 댓글 개수 표시 */}
								<div className="flex gap-1 items-top">
									<MessageSquare
										color="#8B5CF6"
										size={15}
										className="mt-0.5"
									/>
									<p className="text-[14px]">3</p>
								</div>
							</div>
						</div>
						{/* 게시글 내용 */}
						<p className="text-xs font-Regular text-[#6B7280]">
							안녕하세요 수학zl존 입니다 ^^ 오늘은 9등급도 이해할
							수 있는 미적분...
						</p>
						{/* 작성자 이름 */}
						<p className="mt-3 mb-6 text-[14px] font-Regular text-[#1F2937]">
							홍길동
						</p>
						{/* 해시태그 */}
						<div className="flex justify-between items-end">
							<div className="flex gap-2">
								<div
									className="px-4 py-2 rounded-lg bg-[#EA489A]
                        text-white font-Regular text-xs"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-lg bg-[#EA489A]
                        text-white font-Regular text-xs"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-lg bg-[#EA489A]
                        text-white font-Regular text-xs"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-lg bg-[#EA489A]
                        text-white font-Regular text-xs"
								>
									#해시태그
								</div>
							</div>
							<p className="text-[14px] text-[#6B7280]">
								2025-10-10
							</p>
						</div>
					</div>
				</div>
				<div>페이지네이션</div>
				{/* <PageNation /> */}
			</div>
		</>
	);
}
