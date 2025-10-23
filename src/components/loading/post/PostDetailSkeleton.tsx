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
					<div className="bg-white"></div>
				</div>
			</div>
		</>
	);
}
