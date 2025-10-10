export default function PostSearchPage() {
	return (
		<>
			<div>
				<h1 className="font-bold text-[24px] text-[#8B5CF6] mb-[15px] text-left text-middle">
					검색
				</h1>
				{/*검색 바와 검색 버튼*/}
				<div className="flex rounded-[12px] shadow-[0_3px_6px_rgba(0,0,0,0.05)] ">
					<input
						type="textarea"
						id="serchBar"
						placeholder="게시글 제목, @이름, #해시태그 검색 가능..."
						className="w-[862px] text-[14px] px-6 py-4 focus:outline-none rounded-l-[12px] bg-white"
					></input>
					<button
						type="button"
						className="p-4 rounded-r-[12px] bg-[#8B5CF6]
                        text-white font-Medium text-[14px] hover:bg-[#B08DFF]"
					>
						검색
					</button>
				</div>

				{/* 검색 결과 영역 */}
				<div className="flex-col mt-[40px] border-t-2 border-[#E5E7EB] pt-2">
					{/* 사용자 1 */}
					<div className="mb-4 px-6 py-4 flex justify-between items-center bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
						<div className="flex ">
							{/* 유저 프로필 이미지 */}
							<img
								className="w-15 h-15 rounded-[30px] object-cover"
								src="/src/assets/image.png"
								alt="userImg"
							/>
							{/* 이름과 최근 활동 */}
							<div className="ml-4 m-auto">
								<h2 className="text-[14px] font-Regular mb-2">
									홍길동
								</h2>
								<p className="text-[12px] font-Regular text-[#6B7280]">
									마지막 활동: 이틀 전
								</p>
							</div>
						</div>
						{/* 팔로우/팔로잉 버튼 */}
						<button
							type="button"
							className="w-[117px] px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px] align-middle"
						>
							팔로우
						</button>
					</div>
					{/* 사용자 2 */}
					<div className="w-230 mb-4 px-6 py-4 flex justify-between items-center bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
						<div className="flex">
							{/* 유저 프로필 이미지 */}
							<img
								className="w-15 h-15 rounded-[30px] object-cover"
								src="/src/assets/image.png"
								alt="userImg"
							/>
							{/* 이름과 최근 활동 */}
							<div className="ml-4 m-auto">
								<h2 className="text-[14px] font-Regular mb-2">
									홍길동2
								</h2>
								<p className="text-[12px] font-Regular text-[#6B7280]">
									마지막 활동: 이틀 전
								</p>
							</div>
						</div>
						{/* 팔로우/팔로잉 버튼 */}

						<button
							type="button"
							className="group relative w-[117px] px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px] 
                        "
						>
							<p className="inline">팔로잉</p>
							<img
								className="inline ml-2"
								src="/src/assets/Toggle.png"
							/>
							<div className="absolute left-0 w-[117px] p-1 rounded-[8px] mt-2 mx-auto border-1 border-[#EA489A] bg-white group-focus:block hidden">
								<ul>
									<li className="block px-5 py-2 text-[12px] text-center text-[#EA489A] bg-[#ffffff] rounded-[8px] hover:text-[#ffffff] hover:bg-[#FF81C1]">
										메세지 보내기
									</li>
									<li className="block px-5 py-2 text-[12px] text-center text-[#EA489A] bg-[#ffffff] rounded-[8px] hover:text-[#ffffff] hover:bg-[#FF81C1]">
										팔로우 취소
									</li>
								</ul>
							</div>
						</button>
					</div>

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
						<div className="flex justify-between items-end">
							<div className="flex gap-2">
								<div
									className="px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
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
						<div className="flex justify-between items-end">
							<div className="flex gap-2">
								<div
									className="px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
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
						<div className="flex justify-between items-end">
							<div className="flex gap-2">
								<div
									className="px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
								>
									#해시태그
								</div>
								<div
									className="px-4 py-2 rounded-[8px] bg-[#EA489A]
                        text-white font-Regular text-[12px]"
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
			</div>
		</>
	);
}
