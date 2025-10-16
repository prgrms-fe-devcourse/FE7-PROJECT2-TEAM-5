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
