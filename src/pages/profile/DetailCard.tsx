import { useEffect, useMemo, useState } from "react";
import Activities from "./Activities";
import Friends from "./Friends";
import Info from "./Info";
import TabContainer from "./TabContainer";
import { useProfileStore } from "../../stores/profileStore";
import { useMemberStore } from "../../stores/memberStore";

type TabKey = "info" | "activities" | "friends";

export default function DetailCard() {
	const [activeTab, setActiveTab] = useState<
		"info" | "activities" | "friends"
	>("info");
	const { profile, childInfos } = useProfileStore();
	const { currentUserId } = useProfileStore();

	const { fetchUserFollowings, setFriends } = useMemberStore();

	const isMyProfile = profile?.auth_id === currentUserId;

	const tabs = useMemo(() => {
		const baseTabs: { key: TabKey; label: string }[] = [
			{ key: "info", label: "개인 프로필" },
		];
		if (isMyProfile)
			baseTabs.push({ key: "activities", label: "활동 내역" });
		baseTabs.push({ key: "friends", label: "팔로잉" });
		return baseTabs;
	}, [isMyProfile]);

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
			<TabContainer
				tabs={tabs}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>

			<div className="flex flex-col bg-white rounded-xl shadow-xl p-6 space-y-6">
				{activeTab === "info" && (
					<Info
						key={profile.auth_id}
						profile={profile}
						childInfos={childInfos}
					/>
				)}
				{activeTab === "activities" &&
					profile.auth_id === currentUserId && (
						<Activities
							key={profile.auth_id}
							userId={profile.auth_id}
						/>
					)}
				{activeTab === "friends" && (
					<Friends
						key={profile.auth_id}
						friends={friends}
						userId={profile.auth_id}
					/>
				)}
			</div>
		</>
	);
}
