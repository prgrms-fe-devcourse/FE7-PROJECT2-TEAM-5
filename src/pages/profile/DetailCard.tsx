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

	// profile이 로드되기 전엔 아무것도 렌더링하지 않음
	if (!profile || !childInfos) return null;

	// friendsByProfileId를 profile.auth_id 기준으로 가져오기
	const friendsByProfileId = useMemberStore(
		(state) => state.friendsByProfileId,
	);
	const friends = friendsByProfileId[profile.auth_id] ?? [];

	// profile.auth_id가 준비되면 friends fetch 시작
	useEffect(() => {
		if (!profile?.auth_id) return;

		let isMounted = true;

		async function loadFriends() {
			if (!profile?.auth_id) return;
			const friendsData = await fetchUserFollowings(profile.auth_id);
			if (isMounted) {
				setFriends(profile.auth_id, friendsData);
			}
		}

		loadFriends();

		return () => {
			isMounted = false;
		};
	}, [profile?.auth_id, fetchUserFollowings, setFriends]);

	// profile, childInfos 로딩 중
	if (!profile || !childInfos) return <p>Loading profile...</p>;

	return (
		<>
			<TabContainer activeTab={activeTab} setActiveTab={setActiveTab} />

			<div className="flex flex-col bg-white rounded-xl shadow-xl p-6 space-y-6">
				{activeTab === "info" && (
					<Info profile={profile} childInfos={childInfos} />
				)}
				{activeTab === "activities" && <Activities />}
				{activeTab === "friends" && (
					<Friends friends={friends} userId={profile.auth_id} />
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
