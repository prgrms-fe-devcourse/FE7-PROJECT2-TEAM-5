import { useState, useEffect } from "react";

type Friend = {
	id: number;
	name: string;
	status: "온라인" | "오프라인";
	lastActive: string;
	avatarUrl?: string;
};

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
	];
	const [openId, setOpenId] = useState<number | null>(null);

	// 외부 클릭 시 드롭다운 닫기
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			// 클릭한 요소가 버튼이나 드롭다운 안에 있는지 확인
			const target = event.target as HTMLElement;
			if (
				!target.closest(".friend-dropdown") &&
				!target.closest(".friend-button")
			) {
				setOpenId(null);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<>
			<h3 className="text-xl font-bold text-violet-500">
				친구 목록 <span>({dummyFriends.length}명)</span>
			</h3>

			<div className="w-full grid grid-cols-2 gap-2">
				{dummyFriends.map((friend) => (
					<div
						key={friend.id}
						className="w-auto flex items-center gap-3 p-4 rounded-xl transition-colors duration-200 hover:bg-violet-100"
					>
						{/* 이미지 */}
						<div className="w-15 h-15">
							<img
								className="w-full h-full rounded-full bg-amber-400 object-cover"
								src={friend.avatarUrl || "/default-profile.png"}
								alt={`${friend.name} 프로필`}
							/>
						</div>

						{/* 텍스트 */}
						<div className="space-y-2">
							<p>
								{friend.name}
								<span
									className={`ml-1 font-medium text-xs ${
										friend.status === "온라인"
											? "text-[#10B981]"
											: "text-gray-400"
									}`}
								>
									{friend.status}
								</span>
							</p>
							<p className="text-xs text-gray-500">
								{friend.status === "온라인"
									? "현재 활동중"
									: `마지막 활동: ${friend.lastActive}`}
							</p>
						</div>

						{/* 버튼 + 드롭다운 */}
						<div className="relative ml-auto">
							<button
								onClick={() =>
									setOpenId((prev) =>
										prev === friend.id ? null : friend.id,
									)
								}
								className="friend-button text-xs flex items-center gap-2 px-6 py-2 bg-[#EA489A] text-white rounded-lg hover:bg-[#d63f8b] transition-colors"
							>
								<span>팔로잉</span>
								<svg
									width="13"
									height="6"
									viewBox="0 0 13 6"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className={`transition-transform duration-200 ${openId === friend.id ? "rotate-180" : ""}`}
								>
									<path
										d="M1 1L6.5 5L12 1"
										stroke="white"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</button>

							<div
								className={`z-99 friend-dropdown absolute right-0 mt-1 p-1 bg-white rounded-md shadow-lg overflow-hidden transform transition-all duration-200 origin-top ${
									openId === friend.id
										? "opacity-100 scale-100 translate-y-0"
										: "opacity-0 scale-95 -translate-y-2 pointer-events-none"
								}`}
							>
								<button className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-800 text-xs">
									메시지 보내기
								</button>
								<button className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-700 text-xs">
									팔로우 취소
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
