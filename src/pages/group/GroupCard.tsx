export default function GroupCard() {
	return (
		<>
			<article
				className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md"
				aria-label="그룹 카드"
			>
				<div className="h-[180px] w-full bg-gray-200/80" />

				<div className="p-4">
					<div className="flex items-start justify-between gap-3">
						<h3 className="text-base font-semibold text-[#6D28D9] hover:text-[#7C3AED] line-clamp-1">
							수학 스터디
						</h3>
						<span className="shrink-0 text-xs text-gray-500">
							최근 활동 1시간 전
						</span>
					</div>

					<p className="mt-1 text-xs text-gray-600 line-clamp-2">
						수학을 사랑하는 모임
					</p>

					<div className="mt-3 flex items-center justify-between">
						<div className="flex items-center gap-1.5 text-xs text-gray-500">
							<svg
								className="h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								aria-hidden
							>
								<path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
							<span>5명</span>
						</div>

						<button className="h-7 rounded-lg bg-[#8B5CF6] px-3 text-xs font-medium text-white hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-violet-300">
							참여하기
						</button>
					</div>
				</div>
			</article>
		</>
	);
}
