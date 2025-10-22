import { useState } from "react";
import MemberCard from "../../components/MemberCard";
import PageNation from "../../components/PageNation";
import type { Friend } from "../../types/friend";
import { useMemberStore } from "../../stores/memberStore";

export default function GroupMembers({
	members,
	userId,
}: {
	members: Friend[];
	userId: string;
}) {
	const { unFollowUserFnc, removeFriend } = useMemberStore();

	const handleUnfollow = async (friendId: string) => {
		await unFollowUserFnc(userId, friendId);
		removeFriend(userId, friendId);
	};

	const friendsPerPage = 12;
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(members.length / friendsPerPage);

	const displayedFriends = members.slice(
		(currentPage - 1) * friendsPerPage,
		currentPage * friendsPerPage,
	);

	return (
		<>
			<div className="w-full grid grid-cols-2 gap-2">
				{displayedFriends.map((member) => (
					<div className="bg-white rounded-xl">
						<MemberCard
							key={member.users?.auth_id}
							friend={member}
							onUnfollow={() =>
								handleUnfollow(member.users!.auth_id)
							}
						/>
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
