// ProfilePage.tsx
import ProfileCard from "./ProfileCard";
import DetailCard from "./DetailCard";

export default function ProfilePage() {
	return (
		// 전체 컨테이너
		<div className="mx-auto my-8 max-w-6xl p-4 min-h-[611px]">
			{/* 메인 컨텐츠 영역 */}
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
				{/* 왼쪽 프로필 카드 */}
				<ProfileCard />

				{/* 오른쪽 상세 정보 카드 */}
				<DetailCard />
			</div>
		</div>
	);
}
