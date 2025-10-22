export default function GroupMemberSkeleton() {
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
			<div className="w-full grid grid-cols-2 gap-2 border-t border-gray-200 mt-2 pt-6 ">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className="bg-white rounded-xl flex flex-row items-center justify-between p-4"
					>
						<div className="w-15 h-15 rounded-full skeleton-40"></div>
						<div className="w-50 space-y-3">
							<div className="w-18 h-6 rounded-md skeleton-40"></div>
							<div className="w-15 h-4 rounded-md skeleton-40"></div>
						</div>
						<div className="w-25 h-8 rounded-lg skeleton-40"></div>
					</div>
				))}
			</div>
		</>
	);
}
