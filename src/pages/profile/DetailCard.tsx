import { useState } from "react";
import Activities from "./Activities";
import Friends from "./Friends";
import Info from "./Info";
import TabContainer from "./TabContainer";
import { useProfileStore } from "../../stores/profileStore";

export default function DetailCard() {
	const [activeTab, setActiveTab] = useState<
		"info" | "activities" | "friends"
	>("info");

	const { profile, childInfos } = useProfileStore();

	if (!profile) return null;

	return (
		<>
			{/* 탭 버튼 컨테이너 */}
			<TabContainer activeTab={activeTab} setActiveTab={setActiveTab} />

			<div className="flex flex-col bg-white rounded-xl shadow-xl p-6 space-y-6">
				{activeTab === "info" && (
					<Info profile={profile} childInfos={childInfos} />
				)}
				{activeTab === "activities" && <Activities />}
				{activeTab === "friends" && <Friends />}
			</div>
		</>
	);
}
