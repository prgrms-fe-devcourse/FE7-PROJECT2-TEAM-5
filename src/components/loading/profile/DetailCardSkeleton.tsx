export default function DetailCardSkeleton() {
	return (
		<>
			<div className="w-71 h-10 bg-white rounded-lg mb-[21px] flex flex-row px-4 py-2 gap-4">
				<div className="skeleton-50 rounded-sm w-1/3"></div>
				<div className="skeleton-50 rounded-sm w-1/3"></div>
				<div className="skeleton-50 rounded-sm w-1/3"></div>
			</div>
			<div className="w-178 h-102 bg-white rounded-xl p-6">
				<div>
					<div className="w-20 h-7 skeleton-50 rounded-sm mb-2"></div>
					<div className="w-166 h-5 skeleton-50 rounded-sm mb-1"></div>
					<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
						{/* 성별 / 나이 */}
						<div>
							<div className="w-6 h-3 skeleton-40 rounded-sm mb-1"></div>
							<div className="w-8 h-5 skeleton-30 rounded-sm"></div>
						</div>
						<div>
							<div className="w-6 h-3 skeleton-40 rounded-sm mb-1"></div>
							<div className="w-8 h-5 skeleton-30 rounded-sm"></div>
						</div>
						{/* 학년 / 지역 */}
						<div>
							<div className="w-6 h-3 skeleton-40 rounded-sm mb-1"></div>
							<div className="w-8 h-5 skeleton-30 rounded-sm"></div>
						</div>
						<div>
							<div className="w-6 h-3 skeleton-40 rounded-sm mb-1"></div>
							<div className="w-8 h-5 skeleton-30 rounded-sm"></div>
						</div>
						{/* 취미 / 활동 뱃지 */}
						<div>
							<div className="w-6 h-3 skeleton-40 rounded-sm mb-1"></div>
							<div className="w-8 h-5 skeleton-30 rounded-sm"></div>
						</div>
						<div>
							<div className="w-6 h-3 skeleton-40 rounded-sm mb-1"></div>
							<div className="w-8 h-5 skeleton-30 rounded-sm"></div>
						</div>
						{/* 관심 분야 / 가입일 */}
						<div>
							<div className="w-6 h-3 skeleton-40 rounded-sm mb-1"></div>
							<div className="w-8 h-5 skeleton-30 rounded-sm"></div>
						</div>
						<div>
							<div className="w-6 h-3 skeleton-40 rounded-sm mb-1"></div>
							<div className="w-8 h-5 skeleton-30 rounded-sm"></div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
