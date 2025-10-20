import { useState } from "react";
import PageNation from "../../components/PageNation";
import MemberCard from "../../components/MemberCard";
import { useMemberStore } from "../../stores/profileMemberStore";

export default function Friends({ userId }: { userId: string }) {
	const friends = useMemberStore(
		(state) => state.friendsByProfileId[userId] ?? [],
	);
	const { unFollowUserFnc, removeFriend } = useMemberStore();

	const handleUnfollow = async (friendId: string) => {
		await unFollowUserFnc(userId, friendId); // DB + 상태 업데이트
		removeFriend(userId, friendId); // friendsByProfileId[userId]에서 제거
	};

	const friendsPerPage = 10;
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(friends.length / friendsPerPage);

	const pagedFriends = friends.slice(
		(currentPage - 1) * friendsPerPage,
		currentPage * friendsPerPage,
	);

	return (
		<>
			<h3 className="text-xl font-bold text-violet-500">
				친구 목록 <span>({friends.length}명)</span>
			</h3>

			<div className="w-full grid grid-cols-2 gap-2">
				{pagedFriends.length === 0 && (
					<p>현재 팔로우 중인 친구가 없습니다.</p>
				)}
				{pagedFriends.map((friend) => (
					<MemberCard
						key={friend.users?.auth_id}
						friend={friend}
						onUnfollow={() => handleUnfollow(friend.users!.auth_id)} // prop 전달
					/>
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
