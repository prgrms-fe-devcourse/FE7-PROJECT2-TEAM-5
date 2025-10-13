import InfoBlock from "./InfoBlock";

export default function Info() {
	return (
		<>
			<div>
				{/* 정보 헤더 */}
				<h3 className="text-xl font-bold text-violet-500 pb-2">
					개인 정보
				</h3>
				<p className="font-medium text-sm text-gray-500">
					자기소개 글글글
				</p>
			</div>

			{/* 정보 그리드 */}
			<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
				{/* 성별 / 나이 */}
				<InfoBlock title="성별" content="남" />
				<InfoBlock title="나이" content="17" />
				{/* 학년 / 지역 */}
				<InfoBlock title="학년" content="고등학교 2학년" />
				<InfoBlock title="지역" content="서울" />
				{/* 취미 / 활동 뱃지 */}
				<InfoBlock title="취미" content="축구, 음악" />
				<InfoBlock title="활동 뱃지" badges={["🏆 초보 수학 마스터"]} />
				{/* 관심 분야 / 가입일 */}
				<InfoBlock title="관심 분야" tags={["과학", "수학", "국어"]} />
				<InfoBlock title="가입일" content="2025-09-30" />
			</div>
		</>
	);
}
