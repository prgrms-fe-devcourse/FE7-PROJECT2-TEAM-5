type TabContainerProps = {
	activeTab: "info" | "activities" | "friends";
	setActiveTab: (tab: "info" | "activities" | "friends") => void;
};

export default function TabContainer({
	activeTab,
	setActiveTab,
}: TabContainerProps) {
	const tabs = [
		{ key: "info", label: "개인 정보" },
		{ key: "activities", label: "활동 내역" },
		{ key: "friends", label: "친구 목록" },
	] as const;

	return (
		<div className="relative flex flex-row justify-between w-full">
			<div className="relative flex bg-white rounded-md">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						onClick={() => setActiveTab(tab.key)}
						className={`relative px-4 py-2 cursor-pointer text-base font-normal text-center rounded-md transition-colors duration-200 ${
							activeTab === tab.key
								? "bg-violet-500 text-white"
								: "text-violet-500 hover:bg-violet-100"
						}`}
					>
						{tab.label}
					</button>
				))}
			</div>
		</div>
	);
}
