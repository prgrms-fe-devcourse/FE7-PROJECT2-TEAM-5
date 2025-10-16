import { Link } from "react-router";
import GroupCard from "./GroupCard";

export default function GroupPage() {
	return (
		<div className="max-w-[1280px] mx-auto px-6 md:px-8">
			<section className="mt-8 md:mt-10">
				<div className="flex items-center justify-between">
					<h2 className="text-xl md:text-2xl font-semibold tracking-tight">
						내가 활동 중인 그룹
					</h2>

					<Link
						to="/groups/create"
						className="inline-flex h-9 items-center rounded-xl bg-[#8B5CF6] px-4 text-sm font-medium text-white hover:bg-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-violet-300"
					>
						그룹 만들기
					</Link>
				</div>

				<div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
					<Link to="/groups/postList">
						<GroupCard />
					</Link>
					<GroupCard />
					<GroupCard />
					<GroupCard />
				</div>
			</section>

			{/* 전체 그룹 */}
			<section className="mt-12 md:mt-16">
				<h2 className="text-xl md:text-2xl font-semibold tracking-tight">
					전체 그룹
				</h2>

				<div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
					<GroupCard />
					<GroupCard />
					<GroupCard />
					<GroupCard />
					<GroupCard />
					<GroupCard />
					<GroupCard />
					<GroupCard />
				</div>
			</section>
		</div>
	);
}
