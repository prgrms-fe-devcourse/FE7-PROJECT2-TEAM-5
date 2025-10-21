import { Link } from "react-router";
import Button from "./Button";
import { useProfileStore } from "../stores/profileStore";

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
	const currentUserId = useProfileStore((state) => state.currentUserId);
	const isNormalBoard = title === "게시판";
	const isGroupBoard =
		title === "그룹 게시판" &&
		(activeTab === "information" || activeTab === "activity");

	return (
		<>
			<h1 className="font-bold text-[28px] my-3">{title}</h1>

			{/* 버튼 영역 */}
			<div className="flex py-1 justify-between items-center">
				{/* 게시판 탭 버튼 */}
				<div className="inline-flex gap-2">
					{tabs.map((tab) => (
						<Button
							key={tab.key}
							onClick={() => setActiveTab(tab.key)}
							className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer
								${
									activeTab === tab.key
										? "bg-[#8B5CF6] text-white"
										: "bg-white text-gray-700 hover:bg-[#B08DFF] hover:text-white"
								}`}
						>
							{tab.label}
						</Button>
					))}
				</div>

				{/* 검색 / 새 글 / 그룹 생성 버튼 영역 */}
				{(isNormalBoard || isGroupBoard) && (
					<div className="inline-flex gap-2">
						{/* 일반 게시판 전용: 검색 + 글 작성 */}
						{isNormalBoard && (
							<>
								<Button
									type="button"
									className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs hover:bg-[#B08DFF] transition-colors"
								>
									검색
								</Button>
								{currentUserId && (
									<Link
										to="create"
										className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs hover:bg-[#B08DFF] transition-colors"
									>
										글 작성
									</Link>
								)}
							</>
						)}

						{/* 그룹 게시판 전용: 그룹 생성 */}
						{isGroupBoard && (
							<Link
								to="create"
								className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs hover:bg-[#B08DFF] transition-colors"
							>
								그룹 생성
							</Link>
						)}
					</div>
				)}
			</div>
		</>
	);
}
