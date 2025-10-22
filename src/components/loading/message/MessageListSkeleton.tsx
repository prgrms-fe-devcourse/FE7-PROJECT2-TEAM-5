export default function MessageListSkeleton() {
	return (
		<div className="flex-1 overflow-y-auto p-6">
			{/* 날짜별 그룹 스켈레톤 */}
			{Array.from({ length: 2 }).map((_, groupIndex) => (
				<div key={groupIndex}>
					{/* 날짜 구분선 스켈레톤 */}
					<div className="flex justify-center mb-6">
						<div className="h-8 rounded-full w-32 skeleton-40"></div>
					</div>

					{/* 메시지 버블들 스켈레톤 */}
					<div className="w-full space-y-4">
						{Array.from({ length: 4 }).map((_, messageIndex) => {
							// 짝수는 현재사용자 , 홀수는 상대방
							const isCurrentUser = messageIndex % 2 === 0;
							// 고정된 메시지 크기
							const messageLength = 500;

							return (
								<div
									key={messageIndex}
									className={`flex flex-row ${
										isCurrentUser ? "flex-row-reverse" : ""
									} items-end gap-1 mb-4`}
								>
									<div className="flex flex-col gap-1 w-[500px]">
										{/* 메시지 버블 스켈레톤 */}
										<div
											className={`rounded-xl px-4 py-2 ${
												isCurrentUser
													? "skeleton-50"
													: "skeleton-40"
											}`}
											style={{
												width: `${messageLength}px`,
												height: "40px",
											}}
										></div>
									</div>
									{/* 시간 스켈레톤 */}
									<div className="h-3 rounded w-12 skeleton-30"></div>
								</div>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
