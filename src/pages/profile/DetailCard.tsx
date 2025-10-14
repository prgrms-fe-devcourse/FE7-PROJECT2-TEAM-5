import { useEffect, useState } from "react";
import Activities from "./Activities";
import Friends from "./Friends";
import Info from "./Info";
import TabContainer from "./TabContainer";
import { useProfileStore } from "../../stores/profileStore";

export default function DetailCard() {
	const [activeTab, setActiveTab] = useState<
		"info" | "activities" | "friends"
	>("info");

	const { profile, fetchProfile, loading, error, userId } = useProfileStore();

	useEffect(() => {
		fetchProfile(); // 페이지가 열릴 때 프로필 불러오기
	}, [fetchProfile]);

	if (loading) return <p>불러오는 중...</p>;
	if (error) return <p>❌ error 오류: {error}</p>;
	if (!profile || !userId) return <p>로그인이 필요합니다.</p>;

	return (
		<>
			{/* 탭 버튼 컨테이너 */}
			<TabContainer activeTab={activeTab} setActiveTab={setActiveTab} />

			<div className="flex flex-col bg-white rounded-xl shadow-xl p-6 space-y-6">
				{activeTab === "info" && <Info profile={profile} />}
				{activeTab === "activities" && <Activities />}
				{activeTab === "friends" && <Friends />}
			</div>
		</>
	);
}
