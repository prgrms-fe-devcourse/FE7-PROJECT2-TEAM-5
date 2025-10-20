export default function NotificationSkeleton() {
	return (
		<>
			{/* 스켈레톤 알림 카드들 */}
			{Array.from({ length: 3 }).map((_, i) => (
				<div
					key={i}
					className="p-4 rounded-lg border bg-white border-[#E6E9EE]"
				>
					<div className="flex items-start gap-3">
						{/* 아이콘 스켈레톤 */}
						<div className="flex-shrink-0 mt-1">
							<div className="w-5 h-5 rounded-full skeleton-40"></div>
						</div>
						<div className="flex-1 min-w-0">
							{/* 메시지 스켈레톤 */}
							<div className="w-3/4 h-4 rounded-sm skeleton-50 mb-2"></div>
							{/* content 스켈레톤 */}
							{i !== 1 && (
								<div className="w-1/2 h-3 rounded-sm skeleton-30 mb-2"></div>
							)}
							{/* 날짜 스켈레톤 */}
							<div className="w-20 h-3 rounded-sm skeleton-30"></div>
						</div>
					</div>
				</div>
			))}
		</>
	);
}
