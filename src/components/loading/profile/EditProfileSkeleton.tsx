export default function EditProfileSkeleton() {
	return (
		<div className="bg-white rounded-2xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.05)] animate-pulse">
			<h1 className="h-8 w-1/7 bg-gray-200 rounded mb-6"></h1>

			<div className="grid grid-cols-[334px_468px] gap-8">
				{/* 좌측 폼 */}
				<div className="space-y-3">
					{/* 이름 */}
					<div>
						<div className="h-5 w-1/10 bg-gray-200 rounded mb-1"></div>
						<div className="h-10 w-full bg-gray-200 rounded"></div>
					</div>
					{/* 성별 */}
					<div>
						<div className="h-5 w-1/10 bg-gray-200 rounded mb-1"></div>
						<div className="h-10 w-full bg-gray-200 rounded"></div>
					</div>

					{/* 나이 */}
					<div>
						<div className="h-5 w-1/10 bg-gray-200 rounded mb-1"></div>
						<div className="h-10 w-full bg-gray-200 rounded"></div>
					</div>

					{/* 지역 */}
					<div>
						<div className="h-5 w-1/10 bg-gray-200 rounded mb-1"></div>
						<div className="h-10 w-full bg-gray-200 rounded"></div>
					</div>

					{/* 취미 */}
					<div>
						<div className="h-5 w-1/10 bg-gray-200 rounded mb-1"></div>
						<div className="h-10 w-full bg-gray-200 rounded"></div>
					</div>

					{/* 뱃지 */}
					<div>
						<div className="h-5 w-1/10 bg-gray-200 rounded mb-1"></div>
						<div className="h-10 w-full bg-gray-200 rounded"></div>
					</div>
				</div>

				{/* 우측 폼 */}
				<div className="space-y-3">
					{/* 자기소개 */}
					<div>
						<div className="h-5 w-1/10 bg-gray-200 rounded mb-1"></div>
						<div className="h-[264px] w-full bg-gray-200 rounded"></div>
					</div>
					{/* 관심 분야 */}
					<div>
						<div className="h-5 w-1/10 bg-gray-200 rounded mb-1"></div>
						<div className="flex flex-wrap gap-2">
							{Array.from({ length: 27 }).map((_, idx) => (
								<div
									key={idx}
									className="h-7 w-11 bg-gray-200 rounded"
								></div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* 버튼 영역 */}
			<div className="mt-6 flex justify-end gap-3">
				<div className="h-10 w-15 bg-gray-200 rounded"></div>
				<div className="h-10 w-15 bg-gray-200 rounded"></div>
			</div>
		</div>
	);
}
