export default function PostDetailSkeleton() {
	return (
		<>
			<div className="max-w-[1200px] h-[750px] flex flex-row gap-15">
				<div className="max-w-[800px] w-[760px] space-y-4">
					<div className="w-14 h-10 rounded-xl skeleton-40"></div>
					<div className="w-60 h-12 rounded-xl skeleton-40"></div>
					<div className="w-40 h-5 rounded-xl skeleton-40"></div>
					<div className="w-110 h-6 rounded-xl skeleton-40"></div>
					<div className="mt-20 w-11 h-6 rounded-xl skeleton-40"></div>
				</div>
				<div className="w-[500px]">
					<div className="mx-auto my-10 w-30 h-6 rounded-md skeleton-40"></div>
					<div className="border-t border-gray-300 m-4"></div>
					<div className="bg-white w-111 rounded-xl px-6 py-3 space-y-3">
						<div className="flex flex-row justify-between items-start">
							<div className="flex flex-row justify-center items-center gap-1">
								{/* 이미지 */}
								<div className="w-9 h-9 rounded-full skeleton-40"></div>
								<div className="w-20 h-5 rounded-md skeleton-40"></div>
								<div className="w-18 h-3 rounded-md skeleton-40"></div>
							</div>
							<div className="flex flex-row gap-2">
								<div className="w-7 h-4 rounded-sm skeleton-40"></div>
								<div className="w-7 h-4 rounded-sm skeleton-40"></div>
							</div>
						</div>
						<div className="w-25 h-5 rounded-md skeleton-30"></div>
						<div className="relative left-83.5 w-16 h-4 rounded-sm skeleton-50"></div>
					</div>
				</div>
			</div>
		</>
	);
}
