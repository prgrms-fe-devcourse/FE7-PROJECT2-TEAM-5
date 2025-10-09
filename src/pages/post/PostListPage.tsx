// 게시글 리스트 페이지
export default function PostListPage() {
	return (
		<>
			<div className="m-auto px-[40px] py-[30px] ">
				<h1 className="font-bold text-[28px] my-3">게시판</h1>
				{/*버튼 */}
				<div className="flex py-1 justify-between">
					{/* 게시판 이동 버튼 */}
					<div className="inline-flex gap-4">
						<button
							type="button"
							className="h-[33px] px-4 py-2 rounded-[12px] bg-[#ffffff]
						text-black font-Regular text-[12px] hover:bg-[#8B5CF6] hover:text-white"
						>
							자유게시판
						</button>
						<button
							type="button"
							className="h-[33px] px-4 py-2  rounded-[12px] bg-[#ffffff]
						text-black font-Regular text-[12px] hover:bg-[#8B5CF6] hover:text-white"
						>
							초등학생 게시판
						</button>
						<button
							type="button"
							className="h-[33px] px-4 py-2  rounded-[12px] bg-[#ffffff]
						text-black font-Regular text-[12px] hover:bg-[#8B5CF6] hover:text-white"
						>
							중학생 게시판
						</button>
						<button
							type="button"
							className="h-[33px] px-4 py-2 rounded-[12px] bg-[#ffffff]
						text-black font-Regular text-[12px] hover:bg-[#8B5CF6] hover:text-white"
						>
							고등학생 게시판
						</button>
					</div>
					{/* 글 작성 버튼 */}
					<button
						type="button"
						className="h-[33px] px-5 py-2 rounded-[12px] bg-[#8B5CF6]
						text-white font-Regular text-[12px] hover:bg-[#B08DFF] hover:text-white"
					>
						새 글 작성
					</button>
				</div>

				{/* 게시판 영역 */}
				<div className="mt-7">
					{/* 글 1 */}
					<div className="w-230 mb-4 px-6 py-4 rounded-[12px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
						{/* 글 제목과 좋아요, 댓글 수 */}
						<div className="flex justify-between items-start mb-1">
							<h2 className=" text-[18px] font-bold text-[#8B5CF6]">
								미적분 아주 쉽게 이해하기
							</h2>
							{/* 좋아요, 댓글 수 */}
							<div className="flex gap-3">
								{/* 좋아요 개수 표시*/}
								<div className="flex gap-1 items-center">
									<img
										className="object-none"
										src="/src/assets/Heart.png"
										alt="Heart"
									/>
									<p className="text-[14px]">2</p>
								</div>
								{/* 댓글 개수 표시 */}
								<div className="flex gap-1 items-center">
									<img
										className="object-none"
										src="/src/assets/SpeechBubble.png"
										alt="SpeechBubble"
									/>
									<p className="text-[14px]">3</p>
								</div>
							</div>
						</div>
						{/* 게시글 내용 */}
						<p className="text-[12px] font-Regular text-[#6B7280]">
							안녕하세요 수학zl존 입니다 ^^ 오늘은 9등급도 이해할
							수 있는 미적분...
						</p>
						{/* 작성자 이름 */}
						<p className="mt-[11px] mb-[22px] text-[14px] font-Regular text-[#1F2937]">
							홍길동
						</p>
						{/* 해시태그 */}
						<div className="flex gap-2">
							<div
								className="h-[30px] px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
							>
								#해시태그
							</div>
							<div
								className="h-[30px] px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
							>
								#해시태그
							</div>
							<div
								className="h-[30px] px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
							>
								#해시태그
							</div>
							<div
								className="h-[30px] px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
							>
								#해시태그
							</div>
						</div>
					</div>
					{/* 글 2 */}
					<div className="w-230 mb-4 px-6 py-4 rounded-[12px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
						{/* 글 제목과 좋아요, 댓글 수 */}
						<div className="flex justify-between items-start mb-1">
							<h2 className=" text-[18px] font-bold text-[#8B5CF6]">
								미적분 아주 쉽게 이해하기
							</h2>
							{/* 좋아요, 댓글 수 */}
							<div className="flex gap-3">
								{/* 좋아요 개수 표시*/}
								<div className="flex gap-1 items-center">
									<img
										className="object-none"
										src="/src/assets/Heart.png"
										alt="Heart"
									/>
									<p className="text-[14px]">2</p>
								</div>
								{/* 댓글 개수 표시 */}
								<div className="flex gap-1 items-center">
									<img
										className="object-none"
										src="/src/assets/SpeechBubble.png"
										alt="SpeechBubble"
									/>
									<p className="text-[14px]">3</p>
								</div>
							</div>
						</div>
						{/* 게시글 내용 */}
						<p className="text-[12px] font-Regular text-[#6B7280]">
							안녕하세요 수학zl존 입니다 ^^ 오늘은 9등급도 이해할
							수 있는 미적분...
						</p>
						{/* 작성자 이름 */}
						<p className="mt-[11px] mb-[22px] text-[14px] font-Regular text-[#1F2937]">
							홍길동
						</p>
						{/* 해시태그 */}
						<div className="flex gap-2">
							<div
								className="h-[30px] px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
							>
								#해시태그
							</div>
							<div
								className="h-[30px] px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
							>
								#해시태그
							</div>
							<div
								className="h-[30px] px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
							>
								#해시태그
							</div>
							<div
								className="h-[30px] px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
							>
								#해시태그
							</div>
						</div>
					</div>
					{/* 글 3 */}
					<div className="w-230 mb-4 px-6 py-4 rounded-[12px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
						{/* 글 제목과 좋아요, 댓글 수 */}
						<div className="flex justify-between items-start mb-1">
							<h2 className=" text-[18px] font-bold text-[#8B5CF6]">
								미적분 아주 쉽게 이해하기
							</h2>
							{/* 좋아요, 댓글 수 */}
							<div className="flex gap-3">
								{/* 좋아요 개수 표시*/}
								<div className="flex gap-1 items-center">
									<img
										className="object-none"
										src="/src/assets/Heart.png"
										alt="Heart"
									/>
									<p className="text-[14px]">2</p>
								</div>
								{/* 댓글 개수 표시 */}
								<div className="flex gap-1 items-center">
									<img
										className="object-none"
										src="/src/assets/SpeechBubble.png"
										alt="SpeechBubble"
									/>
									<p className="text-[14px]">3</p>
								</div>
							</div>
						</div>
						{/* 게시글 내용 */}
						<p className="text-[12px] font-Regular text-[#6B7280]">
							안녕하세요 수학zl존 입니다 ^^ 오늘은 9등급도 이해할
							수 있는 미적분...
						</p>
						{/* 작성자 이름 */}
						<p className="mt-[11px] mb-[22px] text-[14px] font-Regular text-[#1F2937]">
							홍길동
						</p>
						{/* 해시태그 */}
						<div className="flex gap-2">
							<div
								className="h-[30px] px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
							>
								#해시태그
							</div>
							<div
								className="h-[30px] px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
							>
								#해시태그
							</div>
							<div
								className="h-[30px] px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
							>
								#해시태그
							</div>
							<div
								className="h-[30px] px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
							>
								#해시태그
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
