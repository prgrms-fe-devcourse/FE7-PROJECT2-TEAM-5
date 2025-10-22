import { useState } from "react";
import ActivitiesTab from "./ActivitiesTab";
import ActivitiesPosts from "./ActivitiesPosts";
import ActivitiesComments from "./ActivitiesComments";
import { useActPostStore } from "../../stores/profileActivityStore";

export default function Activities() {
	const [activeTab, setActiveTab] = useState<"posts" | "comments">("posts");
	const { userPosts, userComments } = useActPostStore();

	return (
		<div>
			<h3 className="text-xl font-bold text-violet-500 pb-2">
				활동 내역
			</h3>

			{/* 탭 버튼 + 내용 */}
			<ActivitiesTab activeTab={activeTab} setActiveTab={setActiveTab} />

			{/* 탭 내용 */}
			<div className="mt-4">
				{activeTab === "posts" ? (
					<ActivitiesPosts posts={userPosts} />
				) : (
					<ActivitiesComments comments={userComments} />
				)}
			</div>
		</div>
	);
}
