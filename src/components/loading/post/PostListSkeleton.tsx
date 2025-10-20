export default function PostListSkeleton() {
	return (
		<>
			<div className="w-250 px-10">
				<div>
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
				<div className="border-t border-gray-200 mt-2 pt-6 space-y-2">
					{/* 게시글 스켈레톤 3개 */}
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="w-full px-6 py-6 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
						>
							{/* 제목 + 좋아요 */}
							<div className="flex flex-row justify-between items-start mb-2">
								<div className="w-50 h-5 rounded-sm skeleton-50"></div>
								<div className="flex flex-row gap-3">
									<div className="w-6 h-5 rounded-sm skeleton-40"></div>
									<div className="w-6 h-5 rounded-sm skeleton-40"></div>
								</div>
							</div>

							{/* 작성자 */}
							<div className="w-25 h-4 rounded-sm skeleton-40 mb-3"></div>

							{/* 내용 */}
							<div className="space-y-2 mb-4">
								<div className="w-80 h-3 rounded-sm skeleton-30"></div>
							</div>

							{/* 하단 */}
							<div className="flex flex-row justify-between">
								<div></div>
								<div className="w-18 h-4 rounded-sm skeleton-40"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
}
