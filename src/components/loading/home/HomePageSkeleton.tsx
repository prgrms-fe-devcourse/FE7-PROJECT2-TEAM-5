import { useProfileStore } from "../../../stores/profileStore";

export default function HomePageSkeleton() {
	const isLoggedIn = useProfileStore((state) => state.isLoggedIn);
	return (
		<>
			<div className="mt-30 flex flex-col items-center">
				{/* Top */}
				<div className="flex flex-col items-center justify-center mb-30">
					<div className="w-140 h-16 rounded-xl bg-gray-300 mb-7"></div>
					<div className="w-120 h-14 rounded-xl bg-gray-300 mb-10"></div>
					{/* 버튼 */}
					<div className="flex flex-row gap-4">
						<div className="w-25 h-14 rounded-xl bg-gray-300"></div>
						{!isLoggedIn && (
							<div className="w-25 h-14 rounded-xl bg-gray-300"></div>
						)}
					</div>
				</div>
				{/* 카드들 */}
				<div className="flex flex-row gap-5">
					<div className="w-80 h-48 rounded-xl bg-white px-6 py-7 shadow-md">
						<div className="w-18 h-7 mb-4 rounded-xl bg-gray-300"></div>
						<div className="w-68 h-5 mb-2 rounded-xl bg-gray-300"></div>
						<div className="w-68 h-4 mb-2 rounded-xl bg-gray-300"></div>
						<div className="flex flex-row gap-2">
							<div className="w-11 h-6 rounded-full bg-gray-300"></div>
							<div className="w-11 h-6 rounded-full bg-gray-300"></div>
						</div>
					</div>
					<div className="w-80 h-48 rounded-xl bg-white px-6 py-7 shadow-md">
						<div className="w-18 h-7 mb-4 rounded-xl bg-gray-300"></div>
						<div className="w-68 h-5 mb-2 rounded-xl bg-gray-300"></div>
						<div className="w-68 h-4 mb-2 rounded-xl bg-gray-300"></div>
						<div className="flex flex-row gap-2">
							<div className="w-11 h-6 rounded-full bg-gray-300"></div>
							<div className="w-11 h-6 rounded-full bg-gray-300"></div>
						</div>
					</div>
					<div className="w-80 h-48 rounded-xl bg-white px-6 py-7 shadow-md">
						<div className="w-18 h-7 mb-4 rounded-xl bg-gray-300"></div>
						<div className="w-68 h-5 mb-2 rounded-xl bg-gray-300"></div>
						<div className="w-68 h-4 mb-2 rounded-xl bg-gray-300"></div>
						<div className="flex flex-row gap-2">
							<div className="w-11 h-6 rounded-full bg-gray-300"></div>
							<div className="w-11 h-6 rounded-full bg-gray-300"></div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
