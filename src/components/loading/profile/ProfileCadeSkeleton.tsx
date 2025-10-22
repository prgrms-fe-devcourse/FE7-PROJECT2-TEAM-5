import type { UserProfile } from "../../../types/profile";

export default function ProfileCadeSkeleton({
	profile,
}: {
	profile: UserProfile | null;
}) {
	return (
		<>
			<div className="flex flex-col items-center relative">
				<div className="z-99 w-30 h-30 rounded-xl skeleton-40"></div>
				<div className="w-full flex flex-col items-center absolute top-15 bg-white rounded-xl shadow-xl pt-22 pb-10 px-10">
					<div className="w-30 h-5 skeleton-40 rounded-lg mb-1"></div>
					<div className="w-14 h-9 skeleton-40 rounded-lg mb-2.5"></div>
					<div className="w-36 h-6 skeleton-40 rounded-lg mb-5"></div>
					<div className="w-full h-10 skeleton-40 rounded-xl"></div>
					<div className="flex flex-rol justify-between gap-10 pt-6">
						<div className="flex flex-col items-center">
							<div className="w-8 h-7 skeleton-40 rounded-sm mb-0.5"></div>
							<div className="w-10 h-5 skeleton-40 rounded-sm"></div>
						</div>
						<div className="flex flex-col items-center">
							<div className="w-8 h-7 skeleton-40 rounded-sm mb-0.5"></div>
							<div className="w-10 h-5 skeleton-40 rounded-sm"></div>
						</div>
						<div className="flex flex-col items-center">
							<div className="w-8 h-7 skeleton-40 rounded-sm mb-0.5"></div>
							<div className="w-10 h-5 skeleton-40 rounded-sm"></div>
						</div>
					</div>
					{/* 선생님일 때 */}
					{profile?.role === "teacher" ? (
						<div className="w-full mt-6 px-6 py-4 skeleton-40 rounded-xl "></div>
					) : (
						""
					)}
				</div>
			</div>
		</>
	);
}
