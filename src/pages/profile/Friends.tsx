import { useState } from "react";
import PageNation from "../../components/PageNation";
import MemberCard from "../../components/MemberCard";

export default function Friends() {
	const dummyFriends: Friend[] = [
		{
			id: 1,
			name: "홍길동",
			status: "온라인",
			lastActive: "5분 전",
			avatarUrl: "/images/profile1.png",
		},
		{
			id: 2,
			name: "이몽룡",
			status: "오프라인",
			lastActive: "2시간 전",
			avatarUrl: "/images/profile2.png",
		},
		{
			id: 3,
			name: "성춘향",
			status: "온라인",
			lastActive: "10분 전",
			avatarUrl: "/images/profile3.png",
		},
		{
			id: 4,
			name: "임꺽정",
			status: "오프라인",
			lastActive: "1일 전",
			avatarUrl: "/images/profile4.png",
		},
		{
			id: 5,
			name: "이몽룡",
			status: "오프라인",
			lastActive: "2시간 전",
			avatarUrl: "/images/profile2.png",
		},
		{
			id: 6,
			name: "성춘향",
			status: "온라인",
			lastActive: "10분 전",
			avatarUrl: "/images/profile3.png",
		},
		{
			id: 7,
			name: "임꺽정",
			status: "오프라인",
			lastActive: "1일 전",
			avatarUrl: "/images/profile4.png",
		},
		{
			id: 8,
			name: "이몽룡",
			status: "오프라인",
			lastActive: "2시간 전",
			avatarUrl: "/images/profile2.png",
		},
		{
			id: 9,
			name: "성춘향",
			status: "온라인",
			lastActive: "10분 전",
			avatarUrl: "/images/profile3.png",
		},
		{
			id: 10,
			name: "임꺽정",
			status: "오프라인",
			lastActive: "1일 전",
			avatarUrl: "/images/profile4.png",
		},
		{
			id: 11,
			name: "성춘향",
			status: "온라인",
			lastActive: "10분 전",
			avatarUrl: "/images/profile3.png",
		},
		{
			id: 12,
			name: "임꺽정",
			status: "오프라인",
			lastActive: "1일 전",
			avatarUrl: "/images/profile4.png",
		},
		{
			id: 13,
			name: "성춘향",
			status: "온라인",
			lastActive: "10분 전",
			avatarUrl: "/images/profile3.png",
		},
		{
			id: 14,
			name: "임꺽정",
			status: "오프라인",
			lastActive: "1일 전",
			avatarUrl: "/images/profile4.png",
		},
	];

	const friendsPerPage = 10;
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(dummyFriends.length / friendsPerPage);

	const displayedFriends = dummyFriends.slice(
		(currentPage - 1) * friendsPerPage,
		currentPage * friendsPerPage,
	);

	return (
		<>
			<h3 className="text-xl font-bold text-violet-500">
				친구 목록 <span>({dummyFriends.length}명)</span>
			</h3>

			<div className="w-full grid grid-cols-2 gap-2">
				{displayedFriends.map((friend) => (
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
