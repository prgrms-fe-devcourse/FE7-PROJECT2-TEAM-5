type TabKey = "info" | "activities" | "friends";

type TabContainerProps = {
	tabs: { key: TabKey; label: string }[];
	activeTab: TabKey;
	setActiveTab: (tab: TabKey) => void;
};

export default function TabContainer({
	tabs,
	activeTab,
	setActiveTab,
}: TabContainerProps) {
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
