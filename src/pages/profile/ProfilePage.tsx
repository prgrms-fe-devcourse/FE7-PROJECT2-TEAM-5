import ProfileCard from "./ProfileCard";
import DetailCard from "./DetailCard";

export default function ProfilePage() {
	return (
		// 전체 컨테이너
		<div className="mx-auto w-[1024px]">
			{/* 메인 컨텐츠 영역 */}
			<div className="flex flex-row gap-10 w-full">
				{/* 왼쪽 프로필 카드 */}
				<div className="w-[270px]">
					<ProfileCard />
				</div>

				{/* 오른쪽 상세 정보 영역 */}
				<div className="flex-1 space-y-[21px]">
					{/* 상세 정보 카드 컨테이너 */}
					<DetailCard />
				</div>
			</div>
		</div>
	);
}
