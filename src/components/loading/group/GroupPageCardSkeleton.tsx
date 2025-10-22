export default function GroupPageCardSkeleton({ num }: { num: number }) {
	return (
		<>
			<div className="flex flex-row gap-5">
				{Array.from({ length: num }).map((_, i) => (
					<div key={i}>
						<div className="mt-5 w-60 h-34 rounded-t-2xl skeleton-50"></div>
						<div className="w-60 h-34 rounded-b-2xl bg-white px-5 py-4">
							<div className="flex flex-row justify-between items-start">
								<div className="w-8 h-6 rounded-md skeleton-50"></div>
								<div className="w-8 h-4 rounded-md skeleton-50"></div>
							</div>
							<div className="w-40 h-4 mt-2 rounded-md skeleton-30"></div>
							<div className="mt-7 flex flex-row justify-between items-end">
								<div className="w-7 h-4 rounded-md skeleton-50"></div>
								<div className="w-17 h-6 rounded-md skeleton-50"></div>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
