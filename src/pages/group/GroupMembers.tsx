import { useState } from "react";
import MemberCard from "../../components/MemberCard";
import PageNation from "../../components/PageNation";

export default function GroupMembers() {
	const dummyFriends: Friend[] = [
		{
			id: 1,
			name: "홍길동",
			status: "온라인",
			lastActive: "5분 전",
			avatarUrl: "/images/profile1.png",
		},
	];

	const friendsPerPage = 12;
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(dummyFriends.length / friendsPerPage);

	const displayedFriends = dummyFriends.slice(
		(currentPage - 1) * friendsPerPage,
		currentPage * friendsPerPage,
	);

	return (
		<>
			<div className="w-full grid grid-cols-2 gap-2">
				{displayedFriends.map((friend) => (
					<div className="bg-white rounded-xl">
						<MemberCard friend={friend} />
					</div>
				))}
			</div>
			<PageNation
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</>
	);
}
