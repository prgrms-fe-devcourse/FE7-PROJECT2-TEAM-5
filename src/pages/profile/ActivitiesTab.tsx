type ActivitiesTabProps = {
	activeTab: "posts" | "comments";
	setActiveTab: (tab: "posts" | "comments") => void;
};

export default function ActivitiesTab({
	activeTab,
	setActiveTab,
}: ActivitiesTabProps) {
	return (
		<div className="flex flex-col w-full">
			{/* 탭 버튼 */}
			<div className="flex flex-row w-full border-b-2 border-[#D9D9D9]">
				{/* 내가 작성한 게시글 */}
				<div
					className="flex-1 border-b-2"
					style={{
						borderColor:
							activeTab === "posts" ? "#8B5CF6" : "transparent",
					}}
				>
					<button
						className="w-full cursor-pointer pb-4"
						onClick={() => setActiveTab("posts")}
					>
						<div className="flex flex-row items-center justify-center gap-1">
							<p
								className={`font-bold ${activeTab === "posts" ? "text-violet-500" : "text-gray-500"}`}
							>
								내가 작성한 게시글
							</p>
						</div>
					</button>
				</div>

				{/* 내가 작성한 댓글 */}
				<div
					className="flex-1 border-b-2"
					style={{
						borderColor:
							activeTab === "comments"
								? "#8B5CF6"
								: "transparent",
					}}
				>
					<button
						className="w-full cursor-pointer pb-4"
						onClick={() => setActiveTab("comments")}
					>
						<div className="flex flex-row items-center justify-center gap-1">
							<p
								className={`font-bold ${activeTab === "comments" ? "text-violet-500" : "text-gray-500"}`}
							>
								내가 작성한 댓글
							</p>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
}
