import { useState } from "react";
import ActivitiesTab from "./ActivitiesTab";
import ActivitiesPosts from "./ActivitiesPosts";
import ActivitiesComments from "./ActivitiesComments";

export default function Activities({ userId }: { userId: string }) {
	const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");

	return (
		<div key={userId}>
			<h3 className="text-xl font-bold text-violet-500 pb-2">
				활동 내역
			</h3>

			{/* 탭 버튼 + 내용 */}
			<ActivitiesTab
				key={userId}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>

			{/* 탭 내용 */}
			<div className="mt-4">
				{activeTab === "posts" ? (
					<ActivitiesPosts key={userId} />
				) : (
					<ActivitiesComments key={userId} />
				)}
			</div>
		</div>
	);
}
