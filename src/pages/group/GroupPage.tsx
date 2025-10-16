import { Link } from "react-router";
import GroupCard from "./GroupCard";

export default function GroupPage() {
	const groups = [
		{
			group_id: "1",
			title: "수학 스터디",
			bio: "수학을 사랑하는 모임 수학을 사랑하는 모임 수학을 사랑하는 모임 수학을 사랑하는 모임",
			recent_act: "최근 활동 1시간 전",
			members: 5,
			groups_img_url: "",
		},
		{
			group_id: "2",
			title: "과사모",
			bio: "과학을 사랑하는 모임",
			recent_act: "최근 활동 6시간 전",
			members: 3,
			groups_img_url: "",
		},
		{
			group_id: "3",
			title: "코빠",
			bio: "같이 코딩에 빠져봅시다!",
			recent_act: "최근 활동 5분 전",
			members: 7,
			groups_img_url: "",
		},
		{
			group_id: "4",
			title: "수학 스터디",
			bio: "수학을 사랑하는 모임",
			recent_act: "최근 활동 1시간 전",
			members: 9,
			groups_img_url: "",
		},
		{
			group_id: "4",
			title: "수학 스터디",
			bio: "수학을 사랑하는 모임",
			recent_act: "최근 활동 1시간 전",
			members: 9,
			groups_img_url: "",
		},
		{
			group_id: "4",
			title: "수학 스터디",
			bio: "수학을 사랑하는 모임",
			recent_act: "최근 활동 1시간 전",
			members: 9,
			groups_img_url: "",
		},
		{
			group_id: "4",
			title: "수학 스터디",
			bio: "수학을 사랑하는 모임",
			recent_act: "최근 활동 1시간 전",
			members: 9,
			groups_img_url: "",
		},
		{
			group_id: "4",
			title: "수학 스터디",
			bio: "수학을 사랑하는 모임",
			recent_act: "최근 활동 1시간 전",
			members: 9,
			groups_img_url: "",
		},
		{
			group_id: "4",
			title: "수학 스터디",
			bio: "수학을 사랑하는 모임",
			recent_act: "최근 활동 1시간 전",
			members: 9,
			groups_img_url: "",
		},
		{
			group_id: "4",
			title: "수학 스터디",
			bio: "수학을 사랑하는 모임",
			recent_act: "최근 활동 1시간 전",
			members: 9,
			groups_img_url: "",
		},
		{
			group_id: "4",
			title: "수학 스터디",
			bio: "수학을 사랑하는 모임",
			recent_act: "최근 활동 1시간 전",
			members: 9,
			groups_img_url: "",
		},
		{
			group_id: "4",
			title: "수학 스터디",
			bio: "수학을 사랑하는 모임",
			recent_act: "최근 활동 1시간 전",
			members: 9,
			groups_img_url: "",
		},
	];

	return (
		<div className="max-w-300 mx-auto px-6 md:px-8">
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

				<div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
					{/* <Link to="/groups/posts">
						<GroupCard group={group} />
					</Link> */}
					<p>참여한 그룹이 없습니다.</p>
				</div>
			</section>

			{/* 전체 그룹 */}
			<section className="mt-12 md:mt-16">
				<h2 className="text-xl md:text-2xl font-semibold tracking-tight">
					전체 그룹
				</h2>

				<div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
					{groups.map((group) => (
						<Link to={`${group.title}/posts`}>
							<GroupCard group={group} />
						</Link>
					))}
				</div>
			</section>
		</div>
	);
}
