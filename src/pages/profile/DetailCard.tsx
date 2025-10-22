import { useEffect, useState } from "react";
import Activities from "./Activities";
import Friends from "./Friends";
import Info from "./Info";
import TabContainer from "./TabContainer";
import { useProfileStore } from "../../stores/profileStore";
import { useMemberStore } from "../../stores/memberStore";

export default function DetailCard() {
	const [activeTab, setActiveTab] = useState<
		"info" | "activities" | "friends"
	>("info");
	const { profile, childInfos } = useProfileStore();
	const { fetchUserFollowings, setFriends } = useMemberStore();
	if (!profile || !childInfos) return null;

	const friends = useMemberStore(
		(state) => state.friendsByProfileId[profile?.auth_id] ?? [],
	);

	useEffect(() => {
		async function loadFriends() {
			const friendsData = await fetchUserFollowings(
				profile?.auth_id ? profile.auth_id : "",
			);
			// 모든 프로필에서 친구 목록 저장
			setFriends(profile?.auth_id ? profile.auth_id : "", friendsData);
		}
		loadFriends();
	}, [fetchUserFollowings, setFriends, profile.auth_id]);

	return (
		<>
			{/* 탭 버튼 컨테이너 */}
			<TabContainer activeTab={activeTab} setActiveTab={setActiveTab} />

			<div className="flex flex-col bg-white rounded-xl shadow-xl p-6 space-y-6">
				{activeTab === "info" && (
					<Info profile={profile} childInfos={childInfos} />
				)}
				{activeTab === "activities" && (
					<Activities
						key={profile.auth_id}
						userId={profile.auth_id}
					/>
				{activeTab === "friends" && (
					<Friends friends={friends} userId={profile.auth_id} />
				)}
			</div>
		</>
	);
}
