import { Link } from "react-router";
import { getAge } from "../utils/getAge";
import { getGrade } from "../utils/getGrade";
import { useProfileStore } from "../stores/profileStore";
import { useMemberStore } from "../stores/memberStore";
import basicImage from "../assets/basic_image.png";
import type { Friend } from "../types/friend";

export default function UserListCard({
	user,
	profileBeingViewedId, // 현재 보고 있는 프로필의 auth_id
}: {
	user: User;
	profileBeingViewedId: string;
}) {
	const { currentUserId } = useProfileStore();
	const {
		followStatus,
		followedUserFnc,
		unFollowUserFnc,
		setFollowStatus,
		setUserFollowed,
		setFriends,
	} = useMemberStore();

	const isFollowing = followStatus[user.auth_id] || false;

	const age = user.birth_date ? getAge(user.birth_date) : 0;
	const grade = user.role === "student" && getGrade(age);

	const roleMap: Record<string, string> = {
		student: "학생",
		teacher: "선생님",
		parent: "학부모",
	};

	const handleFollowClick = async (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		if (!currentUserId) return;

		const isMyProfile = currentUserId === profileBeingViewedId;

		if (isFollowing) {
			await unFollowUserFnc(currentUserId, user.auth_id);
			setFollowStatus(user.auth_id, false);
			setUserFollowed((prev) =>
				prev.filter((f) => f.users?.auth_id !== user.auth_id),
			);

			if (isMyProfile) {
				const currentFriends =
					useMemberStore.getState().friendsByProfileId[
						profileBeingViewedId
					] || [];
				setFriends(
					profileBeingViewedId,
					currentFriends.filter(
						(f) => f.users?.auth_id !== user.auth_id,
					),
				);
			}
		} else {
			await followedUserFnc(currentUserId, user.auth_id);
			setFollowStatus(user.auth_id, true);

			const newFriend: Friend = {
				users: {
					auth_id: user.auth_id,
					nickname: user.nickname,
					profile_image_url: user.profile_image_url ?? null,
					is_online: user.is_online ?? false,
				},
				created_at: new Date().toISOString(),
				follower_id: currentUserId,
				following_id: user.auth_id,
				id: crypto.randomUUID(),
			};

			setUserFollowed((prev) => [...prev, newFriend]);

			if (isMyProfile) {
				const currentFriends =
					useMemberStore.getState().friendsByProfileId[
						profileBeingViewedId
					] || [];
				setFriends(profileBeingViewedId, [
					...currentFriends,
					newFriend,
				]);
			}
		}
	};

	const handleMessageClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		console.log("메시지 버튼 구현 예정");
	};

	return (
		<>
			<Link to={`/profile/${user.auth_id}`}>
				<div className="flex flex-row justify-between items-center py-4 px-5 hover:bg-[#F1F3F5]">
					{/* left */}
					<div className="flex flex-row items-center gap-2.5">
						{/* 이미지 */}
						<div className="relative w-12 h-12 rounded-lg">
							<img
								className="w-full h-full rounded-lg object-cover"
								src={user.profile_image_url || basicImage}
								alt={`${user.nickname} 프로필`}
							/>
							<div
								className={`absolute right-0 bottom-0 w-4 h-4 rounded-full border-2 border-white ${
									user.is_online
										? "bg-green-500"
										: "bg-gray-400"
								}`}
							></div>
						</div>
						{/* 정보 */}
						<div className="flex flex-col gap-1 text-sm">
							{/* 이름 */}
							<div className="line-clamp-1">{user.nickname}</div>
							{/* 소속, 학년 (선생님은 전공) */}
							<div>
								{roleMap[user.role] || "알 수 없음"}
								{user.role === "student" && `, ${grade}`}{" "}
								{user.role === "teacher" && `, ${user.major}`}
							</div>
						</div>
					</div>
					{/* right */}
					<div className="space-x-2 text-xs">
						{user.auth_id === currentUserId ? (
							<Link
								to={"/profile/me"}
								className="block px-2 py-1 rounded bg-violet-500 text-white hover:bg-violet-600"
							>
								프로필 보기
							</Link>
						) : (
							<>
								<button
									className={`cursor-pointer px-2 py-1 rounded ${
										isFollowing
											? "bg-violet-500 text-white hover:bg-violet-600"
											: "bg-white border border-violet-500 text-violet-500 hover:bg-violet-100"
									}`}
									onClick={handleFollowClick}
								>
									{isFollowing ? "팔로잉" : "팔로우"}
								</button>

								<button
									className="cursor-pointer px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
									onClick={handleMessageClick}
								>
									메시지
								</button>
							</>
						)}
					</div>
				</div>
			</Link>
		</>
	);
}
