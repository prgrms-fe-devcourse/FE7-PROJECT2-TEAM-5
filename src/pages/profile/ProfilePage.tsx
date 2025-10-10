import ProfileCard from "./ProfileCard";
import DetailCard from "./DetailCard";
import TabContainer from "./TabContainer";

export default function ProfilePage() {
	return (
		// 전체 컨테이너
		<div className="mx-auto my-8 w-[1024px] p-4 min-h-[611px]">
			{/* 메인 컨텐츠 영역 */}
			<div className="grid grid-cols-[1fr_2fr] gap-8">
				{/* 왼쪽 프로필 카드 */}
				<ProfileCard />

				{/* 오른쪽 상세 정보 영역 */}
				<div className="space-y-4">
					{/* 탭 버튼 컨테이너 */}
					<TabContainer />
					{/* 상세  정보 카드 컨테이너 */}
					<DetailCard />
				</div>
			</div>
		</div>
	);
}
