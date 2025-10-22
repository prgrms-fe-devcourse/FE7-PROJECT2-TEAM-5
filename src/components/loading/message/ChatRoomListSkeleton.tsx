export default function ChatRoomListSkeleton() {
	return (
		<div className="flex-1 overflow-y-auto">
			{/* 스켈레톤 채팅방 아이템들 */}
			{Array.from({ length: 6 }).map((_, index) => (
				<div
					key={index}
					className="cursor-pointer flex flex-row p-4 items-center gap-3 animate-pulse"
				>
					{/* 프로필 이미지 스켈레톤 */}
					<div className="w-10 h-10 bg-gray-200 rounded-full"></div>

					{/* 채팅방 정보 스켈레톤 */}
					<div className="flex-1 min-w-0">
						{/* 이름과 읽지 않은 메시지 표시 스켈레톤 */}
						<div className="flex items-center gap-2">
							{/* 사용자 이름 스켈레톤 */}
							<div className="h-4 bg-gray-200 rounded w-20"></div>
							{/* 읽지 않은 메시지 표시 스켈레톤 (가끔 표시) */}
							{index % 3 === 0 && (
								<div className="w-2 h-2 bg-gray-300 rounded-full"></div>
							)}
						</div>

						{/* 마지막 메시지 내용 스켈레톤 */}
						<div className="h-3 bg-gray-100 rounded w-32 mt-1"></div>

						{/* 마지막 메시지 날짜 스켈레톤 */}
						<div className="h-3 bg-gray-100 rounded w-16 mt-1"></div>
					</div>
				</div>
			))}
		</div>
	);
}
