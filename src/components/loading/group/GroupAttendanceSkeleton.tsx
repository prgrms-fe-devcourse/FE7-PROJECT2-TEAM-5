export default function GroupAttendanceSkeleton() {
	return (
		<>
			<div className="w-full my-6 border-b border-gray-200 pb-3">
				<div className="w-80 h-7 rounded-xl skeleton-40"></div>
			</div>
			<div className="space-y-3">
				<div className="w-full h-17 rounded-xl skeleton-40"></div>
				<div className="w-full h-17 rounded-xl skeleton-40"></div>
				<div className="w-full h-17 rounded-xl skeleton-40"></div>
			</div>
		</>
	);
}
