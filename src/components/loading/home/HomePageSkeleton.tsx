export default function HomePageSkeleton() {
	return (
		<>
			<div className="mt-30 flex flex-col items-center">
				{/* Top */}
				<div className="flex flex-col items-center justify-center mb-30">
					<div className="w-140 h-16 rounded-xl skeleton-40 mb-7"></div>
					<div className="w-120 h-14 rounded-xl skeleton-40 mb-10"></div>
					{/* 버튼 */}
					<div className="flex flex-row gap-4">
						<div className="w-30 h-14 rounded-xl skeleton-40"></div>
					</div>
				</div>
				{/* 카드들 */}
				<div className="flex flex-row gap-5">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="w-80 h-48 rounded-xl bg-white px-6 py-7 shadow-md"
						>
							<div className="w-18 h-7 mb-4 rounded-xl skeleton-40"></div>
							<div className="w-68 h-5 mb-2 rounded-xl skeleton-40"></div>
							<div className="w-68 h-4 mb-2 rounded-xl skeleton-40"></div>
							<div className="flex flex-row gap-2">
								<div className="w-11 h-6 rounded-full skeleton-40"></div>
								<div className="w-11 h-6 rounded-full skeleton-40"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
