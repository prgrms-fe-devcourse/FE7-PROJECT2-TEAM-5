import { useEffect, useState } from "react";
import PageNation from "../../components/PageNation";
import MemberCard from "../../components/MemberCard";
import { useMemberStore } from "../../stores/profileMemberStore";

export default function Friends({ userId }: { userId: string }) {
	const { userFollowed, fetchUserFollowings } = useMemberStore();

	useEffect(() => {
		fetchUserFollowings(userId);
	}, []);

	const friendsPerPage = 10;
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(userFollowed.length / friendsPerPage);

	const friends = userFollowed.slice(
		(currentPage - 1) * friendsPerPage,
		currentPage * friendsPerPage,
	);

	return (
		<>
			<h3 className="text-xl font-bold text-violet-500">
				친구 목록 <span>({userFollowed.length}명)</span>
			</h3>

			<div className="w-full grid grid-cols-2 gap-2">
				{friends.length === 0 && (
					<p>현재 팔로우 중인 친구가 없습니다.</p>
				)}
				{friends.map((friend) => (
					<MemberCard friend={friend} />
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
