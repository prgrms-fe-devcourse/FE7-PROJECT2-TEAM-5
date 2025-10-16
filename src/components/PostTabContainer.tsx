import { Link } from "react-router";

type TabItem = {
	key: string;
	label: string;
};

type PostTabContainerProps = {
	activeTab: string;
	setActiveTab: (tab: string) => void;
	title: string;
	tabs: readonly TabItem[];
};

export default function PostTabContainer({
	activeTab,
	setActiveTab,
	title,
	tabs,
}: PostTabContainerProps) {
	return (
		<>
			<h1 className="font-bold text-[28px] my-3">{title}</h1>

			{/* 버튼 영역 */}
			<div className="flex py-1 justify-between items-center">
				{/* 게시판 탭 버튼 */}
				<div className="inline-flex gap-2">
					{tabs.map((tab) => (
						<button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`px-4 py-2 rounded-xl  text-xs font-medium transition-colors
								${
									activeTab === tab.key
										? "bg-[#8B5CF6] text-white"
										: "bg-white text-gray-700 hover:bg-[#B08DFF] hover:text-white"
								}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* 검색 / 새 글 버튼 */}
				<div className="inline-flex gap-2">
					{title === "게시판" ? (
						<>
							<button
								type="button"
								className="px-4 py-2 rounded-xl bg-[#8B5CF6]
						text-white text-xs hover:bg-[#B08DFF] transition-colors"
							>
								검색
							</button>
						</>
					) : (
						""
					)}
					<Link
						to={"create"}
						className="px-4 py-2 rounded-xl bg-[#8B5CF6]
						text-white text-xs hover:bg-[#B08DFF] transition-colors"
					>
						{title === "게시판" ? "글 작성" : "그룹 생성"}
					</Link>
				</div>
			</div>
		</>
	);
}
