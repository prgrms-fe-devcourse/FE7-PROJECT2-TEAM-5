export default function GroupAttendanceSkeleton() {
	return (
		<>
			<div className="w-full">
				{/* List 이름 */}
				<div className="w-[160px] h-[40px] rounded-xl skeleton-40 mb-4"></div>
				{/* 탭 UI */}
				<div className="flex flex-row justify-between pb-1">
					<div className="flex flex-row gap-2">
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className="w-[88px] h-[32px] rounded-xl skeleton-40"
							></div>
						))}
					</div>
					<div className="w-17 h-8 rounded-xl skeleton-40"></div>
				</div>
			</div>
			<div>
				<div className="w-full my-6 border-b border-gray-200 pb-3">
					<div className="w-80 h-7 rounded-xl skeleton-40"></div>
				</div>
				<div className="space-y-3">
					<div className="w-full h-17 rounded-xl skeleton-40"></div>
					<div className="w-full h-17 rounded-xl skeleton-40"></div>
					<div className="w-full h-17 rounded-xl skeleton-40"></div>
				</div>
			</div>
		</>
	);
}
