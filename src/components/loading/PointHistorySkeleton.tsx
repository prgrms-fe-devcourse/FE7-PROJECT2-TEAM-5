export default function PointHistorySkeleton() {
	return (
		<div className="space-y-2">
			{/* 스켈레톤 아이템들 */}
			{[...Array(5)].map((_, index) => (
				<div
					key={index}
					className="flex items-center justify-between p-3 bg-gray-50 bg-opacity-80 rounded-lg animate-pulse"
				>
					<div className="flex-1">
						{/* 설명 */}
						<div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
						{/* 날짜  */}
						<div className="h-3 bg-gray-300 rounded w-1/2"></div>
					</div>
					{/* 포인트 */}
					<div className="h-4 bg-gray-300 rounded w-16"></div>
				</div>
			))}
		</div>
	);
}
