import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function MemberCard({ friend }: { friend: Friend }) {
	const [openId, setOpenId] = useState<number | null>(null);
	const [following, setFollowing] = useState<boolean>(false);

	// 외부 클릭 시 드롭다운 닫기
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
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

	const handleFollow = () => {
		if (!following) {
			setFollowing(true);
		} else {
			setOpenId(null);
			setFollowing(false);
		}
	};

	return (
		<>
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
							? "현재 활동 중"
							: `마지막 활동: ${friend.lastActive}`}
					</p>
				</div>

				{/* 버튼 + 드롭다운 */}
				<div className="relative ml-auto">
					{/* 본인 */}
					{/* <button
						onClick={() =>
							setOpenId((prev) =>
								prev === friend.id ? null : friend.id,
							)
						}
						className="friend-button text-xs flex items-center gap-2 px-6 py-2 bg-[#EA489A] text-white rounded-lg hover:bg-[#d63f8b] transition-colors"
					>
						<span>프로필로 이동</span>
					</button> */}
					{!following ? (
						<button
							onClick={handleFollow}
							className="cursor-pointer friend-button text-xs flex items-center gap-2 px-6 py-2 border border-[#EA489A] bg-white rounded-lg hover:bg-[#EA489A] hover:text-white transition-colors"
						>
							<span>팔로우하기</span>
						</button>
					) : (
						<button
							onClick={() =>
								setOpenId((prev) =>
									prev === friend.id ? null : friend.id,
								)
							}
							className="cursor-pointer friend-button text-xs flex items-center gap-2 px-6 py-2 bg-[#EA489A] text-white rounded-lg hover:bg-[#d63f8b] transition-colors"
						>
							<span>팔로잉</span>
							<ChevronDown
								size={16}
								className={`transition-transform duration-200 ${
									openId === friend.id ? "rotate-180" : ""
								}`}
							/>
						</button>
					)}

					<div
						className={`friend-dropdown z-50 absolute right-0 mt-1 p-1 bg-white rounded-md shadow-lg overflow-hidden transform transition-all duration-200 origin-top ${
							openId === friend.id
								? "opacity-100 scale-100 translate-y-0"
								: "opacity-0 scale-95 -translate-y-2 pointer-events-none"
						}`}
					>
						<button className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-800 text-xs">
							메시지 보내기
						</button>
						<button
							onClick={handleFollow}
							className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-700 text-xs"
						>
							팔로우 취소
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
