import { useState } from "react";
import Activities from "./Activities";
import Friends from "./Friends";
import Info from "./Info";
import TabContainer from "./TabContainer";

export default function DetailCard() {
	const [activeTab, setActiveTab] = useState<
		"info" | "activities" | "friends"
	>("info");

	return (
		<>
			{/* 탭 버튼 컨테이너 */}
			<TabContainer activeTab={activeTab} setActiveTab={setActiveTab} />

			<div className="flex flex-col bg-white rounded-xl shadow-xl p-6 space-y-6">
				{activeTab === "info" && <Info />}
				{activeTab === "activities" && <Activities />}
				{activeTab === "friends" && <Friends />}
			</div>
		</>
	);
}
