import { ChevronDown } from "lucide-react";
import type { Friend } from "../types/friend";
import basicImage from "../assets/basic_image.png";
import { useMemberStore } from "../stores/memberStore";
import { useProfileStore } from "../stores/profileStore";
import { useEffect, useState } from "react";
import Button from "./Button";
import { Link } from "react-router";
import { timeAgoIntl } from "../utils/timeAgoIntl";

type MemberCardProps = {
	friend: Friend;
	userId?: string;
	onUnfollow: (friendId: string) => void;
};

export default function MemberCard({
	friend,
	userId,
	onUnfollow,
}: MemberCardProps) {
	const { followStatus, followedUserFnc, unFollowUserFnc } = useMemberStore();
	const { currentUserId } = useProfileStore();
	const isFollowing = followStatus[friend.users?.auth_id ?? ""] || false;

	const [openId, setOpenId] = useState<string | null>(null);
	console.log(friend.users?.last_seen);
	const time = timeAgoIntl(
		friend.users?.last_seen ? friend.users?.last_seen : new Date(),
	);

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
		if (!friend.users?.auth_id) return;

		if (!isFollowing) {
			followedUserFnc(currentUserId!, friend.users.auth_id);
		}
		setOpenId(null);
	};

	const handleUnfollowClick = async () => {
		if (!friend.users?.auth_id || !currentUserId) return;

		await unFollowUserFnc(currentUserId, friend.users.auth_id);
		onUnfollow?.(friend.users.auth_id);
	};

	return (
		<>
			<div
				key={friend.users?.auth_id}
				className="w-auto flex items-center gap-3 p-4 rounded-xl transition-colors duration-200 hover:bg-violet-100"
			>
				{/* 이미지 */}
				<div className="relative w-15 h-15">
					<img
						className="w-full h-full rounded-full object-cover"
						src={friend.users?.profile_image_url || basicImage}
						alt={`${friend.users?.nickname} 프로필`}
					/>
					<div
						className={`absolute right-0 bottom-0 w-4 h-4 bg-${friend.users?.is_online ? "green" : "red"}-500 rounded-full border-2 border-white`}
					></div>
				</div>

				{/* 텍스트 */}
				<div className="flex-1 space-y-2">
					<p className="line-clamp-1">{friend.users?.nickname}</p>
					<p className="text-xs text-gray-500">
						{friend.users?.is_online
							? "현재 활동 중"
							: `마지막 활동: ${time}`}
						{/* 최근 1시간 전 활동 */}
					</p>
				</div>

				{/* 버튼 + 드롭다운 */}
				<div className="relative ml-auto">
					{!isFollowing ? (
						<Button
							onClick={handleFollow}
							className="friend-button text-xs flex items-center gap-2 px-6 py-2 border border-[#EA489A] bg-white rounded-lg hover:bg-[#EA489A] hover:text-white transition-colors"
						>
							<span>팔로우하기</span>
						</Button>
					) : (
						<Button
							onClick={() =>
								setOpenId((prev) =>
									prev === friend.users!.auth_id
										? null
										: friend.users!.auth_id,
								)
							}
							className="friend-button text-xs flex items-center gap-2 w-27 px-6 py-2 bg-[#EA489A] text-white rounded-lg hover:bg-[#d63f8b] transition-colors"
						>
							<span>팔로잉</span>
							<ChevronDown
								size={16}
								className={`transition-transform duration-200 ${
									openId === friend.users?.auth_id
										? "rotate-180"
										: ""
								}`}
							/>
						</Button>
					)}

					<div
						className={`friend-dropdown z-50 absolute right-0 mt-1 p-1 w-27 bg-white rounded-md shadow-lg overflow-hidden transform transition-all duration-200 origin-top ${
							openId === friend.users?.auth_id
								? "opacity-100 scale-100 translate-y-0"
								: "opacity-0 scale-95 -translate-y-2 pointer-events-none"
						}`}
					>
						<Link
							to={`/profile/${friend.users?.auth_id}`}
							className="block w-full text-left p-2 hover:bg-gray-100 text-gray-800 text-xs"
						>
							프로필 보기
						</Link>
						<Button className="block w-full text-left p-2 hover:bg-gray-100 text-gray-800 text-xs">
							메시지 보내기
						</Button>
						{userId === currentUserId ? (
							<Button
								onClick={handleUnfollowClick}
								className="block w-full text-left p-2 hover:bg-gray-100 text-red-700 text-xs"
							>
								팔로우 취소
							</Button>
						) : (
							""
						)}
					</div>
				</div>
			</div>
		</>
	);
}
