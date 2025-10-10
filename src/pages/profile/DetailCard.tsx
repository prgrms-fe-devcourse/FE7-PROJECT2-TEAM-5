import InfoBlock from "./InfoBlock";
import TabButton from "./TabButton";

export default function DetailCard() {
	return (
		// 오른쪽 영역- 상세 정보 카드
		<div className="flex flex-col bg-white rounded-xl shadow-xl p-8 space-y-6">
			{/* 탭 네비게이션 */}
			<div className="flex w-full border-gray-200">
				<TabButton label="개인 정보" isActive={true} />
				<TabButton label="활동 내역" isActive={false} />
				<TabButton label="친구 목록" isActive={false} />
			</div>

			{/* 정보 헤더 */}
			<div className="text-xl font-bold text-violet-500 pb-4 border-gray-100">
				개인 정보
			</div>

			{/* 정보 그리드 */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
				{" "}
				{/* 모바일 대비 1열, 이후 2열 */}
				{/* 소개 */}
				<InfoBlock
					title=""
					content={`아아아아앙아아아아아아아앙아아아아아아아앙아아아아아아아앙아아아아아아아앙아아아아아아아앙아아앙아아아
아아아아앙아아아아아아아앙아아아아아아아앙아아아아아아아앙아아아
앙아아앙아아앙아아앙아아앙아아`}
					isFullWidth={true}
				/>
				{/* 성별 / 나이 */}
				<InfoBlock title="성별" content="남" />
				<InfoBlock title="나이" content="17" />
				{/* 학년 / 지역 */}
				<InfoBlock title="학년" content="고등학교 2학년" />
				<InfoBlock title="지역" content="서울" />
				{/* 취미 / 활동 뱃지 */}
				<InfoBlock title="취미" content="축구, 음악" />
				<InfoBlock
					title="활동 뱃지"
					badges={["🏆 초보 수학 마스터", "🎖 다학왕"]}
				/>
				{/* 관심 분야 / 가입일 */}
				<InfoBlock title="관심 분야" tags={["과학", "수학", "국어"]} />
				<InfoBlock title="가입일" content="2025-09-30" />
			</div>
		</div>
	);
}
