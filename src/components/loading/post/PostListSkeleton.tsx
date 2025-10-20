export default function PostListSkeleton() {
	return (
		<>
			<div className="w-250 px-10">
				<div>
					{/* List 이름 */}
					<div className="w-20 h-10 rounded-xl bg-gray-300 mb-4"></div>
					{/* 탭 UI */}
					<div className="flex flex-row justify-between pb-1">
						<div className="flex flex-row gap-2">
							<div className="w-22 h-8 rounded-xl bg-gray-300"></div>
							<div className="w-22 h-8 rounded-xl bg-gray-300"></div>
							<div className="w-22 h-8 rounded-xl bg-gray-300"></div>
							<div className="w-22 h-8 rounded-xl bg-gray-300"></div>
						</div>
						<div className="w-17 h-8 rounded-xl bg-gray-300"></div>
					</div>
				</div>
				<div className="border-t border-gray-300 mt-2 pt-6 space-y-2">
					{/* 게시글1 */}
					<div className="w-full px-6 py-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
						<div className="flex flex-row justify-between items-start mb-2">
							{/* 제목 */}
							<div className="w-50 h-5 rounded-sm bg-gray-300"></div>
							{/* 좋아요, 댓글 */}
							<div className="flex flex-row gap-3">
								<div className="w-6 h-5 rounded-sm bg-gray-300"></div>
								<div className="w-6 h-5 rounded-sm bg-gray-300"></div>
							</div>
						</div>
						{/* 작성자 */}
						<div className="w-25 h-4 rounded-sm bg-gray-300 mb-3"></div>
						{/* 내용 */}
						<div className="w-80 h-3 rounded-sm bg-gray-300 mb-3"></div>
						<div className="flex flex-row justify-between">
							<div className="w-11 h-6 rounded-sm bg-gray-300"></div>
							{/* 날짜 */}
							<div className="w-18 h-4 rounded-sm bg-gray-300"></div>
						</div>
					</div>
					{/* 게시글2 */}
					<div className="w-full px-6 py-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
						<div className="flex flex-row justify-between items-start mb-2">
							{/* 제목 */}
							<div className="w-50 h-5 rounded-sm bg-gray-300"></div>
							{/* 좋아요, 댓글 */}
							<div className="flex flex-row gap-3">
								<div className="w-6 h-5 rounded-sm bg-gray-300"></div>
								<div className="w-6 h-5 rounded-sm bg-gray-300"></div>
							</div>
						</div>
						{/* 작성자 */}
						<div className="w-25 h-4 rounded-sm bg-gray-300 mb-3"></div>
						{/* 내용 */}
						<div className="w-80 h-3 rounded-sm bg-gray-300 mb-3"></div>
						<div className="flex flex-row justify-between">
							<div className="w-11 h-6 rounded-sm bg-gray-300"></div>
							{/* 날짜 */}
							<div className="w-18 h-4 rounded-sm bg-gray-300"></div>
						</div>
					</div>
					{/* 게시글3 */}
					<div className="w-full px-6 py-4 rounded-xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
						<div className="flex flex-row justify-between items-start mb-2">
							{/* 제목 */}
							<div className="w-50 h-5 rounded-sm bg-gray-300"></div>
							{/* 좋아요, 댓글 */}
							<div className="flex flex-row gap-3">
								<div className="w-6 h-5 rounded-sm bg-gray-300"></div>
								<div className="w-6 h-5 rounded-sm bg-gray-300"></div>
							</div>
						</div>
						{/* 작성자 */}
						<div className="w-25 h-4 rounded-sm bg-gray-300 mb-3"></div>
						{/* 내용 */}
						<div className="w-80 h-3 rounded-sm bg-gray-300 mb-3"></div>
						<div className="flex flex-row justify-between">
							<div className="w-11 h-6 rounded-sm bg-gray-300"></div>
							{/* 날짜 */}
							<div className="w-18 h-4 rounded-sm bg-gray-300"></div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
