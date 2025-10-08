export default function DmPage() {
	return (
		<>
			<div className="w-[1000px] h-[790px] bg-white rounded-xl mt-10 flex flex-row overflow-hidden">
				{/* 채팅 리스트 */}
				<div className="w-[250px] border-r border-[#E5E7EB] bg-[#F9FAFB] rounded-l-xl flex flex-col">
					<div className="h-[60px] border-b border-[#E5E7EB] rounded-t-xl p-4">
						<h2 className="font-bold text-lg text-[#8B5CF6]">
							채팅
						</h2>
					</div>
					{/* 채팅방 목록 */}
					<div className="flex-1 overflow-y-auto">
						<div className="cursor-pointer flex flex-row p-4 items-center gap-3 hover:bg-[rgba(139,92,246,0.1)]">
							<div className="w-10 h-10 bg-[#D9D9D9] rounded-full"></div>
							<span>홍길동</span>
						</div>
						<div className="cursor-pointer flex flex-row p-4 items-center gap-3 hover:bg-[rgba(139,92,246,0.1)]">
							<div className="w-10 h-10 bg-[#D9D9D9] rounded-full"></div>
							<span>김길동</span>
						</div>
					</div>
				</div>
				{/* 나중에 데이터 받아와서 사용할 로직 */}
				{/* <div className="w-[250px] border-r border-[#E5E7EB] bg-[#F9FAFB] rounded-l-xl">
					{매개변수.map((room) => (
						<div
							key={room.id}
							className="cursor-pointer flex flex-row p-4 items-center gap-3 hover:bg-[rgba(139,92,246,0.1)]"
						>
							<div className="w-10 h-10 bg-[#D9D9D9] rounded-full">
								<img
									src={room.user.avatar}
									alt={room.user.name}
								/>
							</div>
							<span>{room.user.name}</span>
						</div>
					))}
				</div> */}
				{/* 채팅창 */}
				<div className="flex-1 flex flex-col">
					{/* 상단 헤더 */}
					<div className="h-[60px] border-b border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center px-6">
						<h3 className="text-xl font-medium">홍길동</h3>
						<button className="w-[30px] h-[30px] bg-[#d9d9d9] cursor-pointer"></button>
					</div>

					{/* 채팅 내용 영역 */}
					<div className="flex-1 flex flex-col overflow-hidden">
						{/* 스크롤 되는 본문 */}
						<div className="flex-1 overflow-y-auto p-6">
							{/* 날짜 */}
							<div className="flex justify-center">
								<span className="inline-block px-4 py-2 bg-[#E5E7EB] rounded-full mb-6 text-sm font-light">
									2025년 10월 3일 금요일
								</span>
							</div>

							{/* 채팅 내용 */}
							<div className="w-full space-y-4">
								{/* 받은 메시지 */}
								<div className="flex flex-row items-end gap-1">
									<div className="flex flex-col gap-1 w-[500px]">
										<p className="bg-[#E5E7EB] rounded-xl px-4 py-2">
											안녕하세요! 이번 과제 관련 질문이
											있어요.
										</p>
										<p className="bg-[#E5E7EB] rounded-xl px-4 py-2">
											1번 문제를 풀었는데 답이 자꾸
											틀려요...
										</p>
									</div>
									<span className="text-xs">22:10</span>
								</div>

								{/* 보낸 메시지 */}
								<div className="flex flex-row-reverse items-end gap-1">
									<div className="flex flex-col gap-1 w-[500px]">
										<p className="bg-[#8B5CF6] text-white rounded-xl px-4 py-2">
											안녕하세요! 풀이를 볼 수 있을까요?
										</p>
									</div>
									<span className="text-xs">22:11</span>
								</div>

								{/* 받은 메시지 */}
								<div className="flex flex-row items-end gap-1">
									<div className="flex flex-col gap-1 w-[500px]">
										<p className="bg-[#E5E7EB] rounded-xl px-4 py-2">
											안녕하세요! 이번 과제 관련 질문이
											있어요.
										</p>
										<p className="bg-[#E5E7EB] rounded-xl px-4 py-2">
											1번 문제를 풀었는데 답이 자꾸
											틀려요...
										</p>
									</div>
									<span className="text-xs">22:10</span>
								</div>

								{/* 보낸 메시지 */}
								<div className="flex flex-row-reverse items-end gap-1">
									<div className="flex flex-col gap-1 w-[500px]">
										<p className="bg-[#8B5CF6] text-white rounded-xl px-4 py-2">
											안녕하세요! 풀이를 볼 수 있을까요?
										</p>
									</div>
									<span className="text-xs">22:11</span>
								</div>

								{/* 받은 메시지 */}
								<div className="flex flex-row items-end gap-1">
									<div className="flex flex-col gap-1 w-[500px]">
										<p className="bg-[#E5E7EB] rounded-xl px-4 py-2">
											안녕하세요! 이번 과제 관련 질문이
											있어요.
										</p>
										<p className="bg-[#E5E7EB] rounded-xl px-4 py-2">
											1번 문제를 풀었는데 답이 자꾸
											틀려요...
										</p>
									</div>
									<span className="text-xs">22:10</span>
								</div>

								{/* 보낸 메시지 */}
								<div className="flex flex-row-reverse items-end gap-1">
									<div className="flex flex-col gap-1 w-[500px]">
										<p className="bg-[#8B5CF6] text-white rounded-xl px-4 py-2">
											안녕하세요! 풀이를 볼 수 있을까요?
										</p>
									</div>
									<span className="text-xs">22:11</span>
								</div>

								{/* 받은 메시지 */}
								<div className="flex flex-row items-end gap-1">
									<div className="flex flex-col gap-1 w-[500px]">
										<p className="bg-[#E5E7EB] rounded-xl px-4 py-2">
											안녕하세요! 이번 과제 관련 질문이
											있어요.
										</p>
										<p className="bg-[#E5E7EB] rounded-xl px-4 py-2">
											1번 문제를 풀었는데 답이 자꾸
											틀려요...
										</p>
									</div>
									<span className="text-xs">22:10</span>
								</div>

								{/* 보낸 메시지 */}
								<div className="flex flex-row-reverse items-end gap-1">
									<div className="flex flex-col gap-1 w-[500px]">
										<p className="bg-[#8B5CF6] text-white rounded-xl px-4 py-2">
											안녕하세요! 풀이를 볼 수 있을까요?
										</p>
									</div>
									<span className="text-xs">22:11</span>
								</div>

								{/* 받은 메시지 */}
								<div className="flex flex-row items-end gap-1">
									<div className="flex flex-col gap-1 w-[500px]">
										<p className="bg-[#E5E7EB] rounded-xl px-4 py-2">
											안녕하세요! 이번 과제 관련 질문이
											있어요.
										</p>
										<p className="bg-[#E5E7EB] rounded-xl px-4 py-2">
											1번 문제를 풀었는데 답이 자꾸
											틀려요...
										</p>
									</div>
									<span className="text-xs">22:10</span>
								</div>

								{/* 보낸 메시지 */}
								<div className="flex flex-row-reverse items-end gap-1">
									<div className="flex flex-col gap-1 w-[500px]">
										<p className="bg-[#8B5CF6] text-white rounded-xl px-4 py-2">
											안녕하세요! 풀이를 볼 수 있을까요?
										</p>
									</div>
									<span className="text-xs">22:11</span>
								</div>

								{/* 받은 메시지 */}
								<div className="flex flex-row items-end gap-1">
									<div className="flex flex-col gap-1 w-[500px]">
										<p className="bg-[#E5E7EB] rounded-xl px-4 py-2">
											안녕하세요! 이번 과제 관련 질문이
											있어요.
										</p>
										<p className="bg-[#E5E7EB] rounded-xl px-4 py-2">
											1번 문제를 풀었는데 답이 자꾸
											틀려요...
										</p>
									</div>
									<span className="text-xs">22:10</span>
								</div>

								{/* 보낸 메시지 */}
								<div className="flex flex-row-reverse items-end gap-1">
									<div className="flex flex-col gap-1 w-[500px]">
										<p className="bg-[#8B5CF6] text-white rounded-xl px-4 py-2">
											안녕하세요! 풀이를 볼 수 있을까요?
										</p>
									</div>
									<span className="text-xs">22:11</span>
								</div>
							</div>
						</div>

						{/* 입력창 */}
						<form className="w-full p-4 border-t border-[#E5E7EB] flex items-center gap-2 bg-white">
							<input
								type="text"
								placeholder="메시지를 입력하세요"
								className="flex-1 h-11 border border-[#E5E7EB] rounded-xl p-2"
							/>
							<input
								type="file"
								className="hidden"
								id="file-upload"
								accept="image/*"
							/>
							<label
								htmlFor="file-upload"
								className="w-11 h-11 border border-[#E5E7EB] rounded-lg flex justify-center items-center cursor-pointer"
							>
								{/* 이미지 전송 버튼 아이콘 */}
								{/* 이미지를 첨부하면 이미지 전송할지 팝업창이 나오고 그 팝업창에는
                                이미지 프리뷰가 나오고 전송하시겠습니까? 문구를 통해 전송할지 취소할지 결정 */}
							</label>
							<button
								type="submit"
								className="cursor-pointer text-sm text-white font-medium rounded-lg px-4 py-3 bg-[#8B5CF6]"
							>
								전송
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
