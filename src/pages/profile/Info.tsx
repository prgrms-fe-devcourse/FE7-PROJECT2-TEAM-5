import { getAge } from "../../utils/getAge";
import { getGrade } from "../../utils/getGrade";
import InfoBlock from "./InfoBlock";

export default function Info({ profile }: { profile: UserProfile }) {
	const age = profile.birth_date ? getAge(profile.birth_date) : 0;
	const grade = profile.role === "student" ? getGrade(age) : "";

	return (
		<>
			<div>
				{/* 정보 헤더 */}
				<h3 className="text-xl font-bold text-violet-500 pb-2">
					개인 정보
				</h3>
				<p className="font-medium text-sm text-gray-500">
					{profile.bio}
				</p>
			</div>

			{/* 정보 그리드 */}
			<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
				{/* 성별 / 나이 */}
				<InfoBlock title="성별" content={profile.gender} />
				<InfoBlock title="나이" content={age} />
				{/* 학년 / 지역 */}
				<InfoBlock title="학년" content={grade} />
				<InfoBlock title="지역" content={profile.region} />
				{/* 취미 / 활동 뱃지 */}
				<InfoBlock
					title="취미"
					content={profile.habits?.join("").split(",").join(", ")}
				/>
				<InfoBlock title="활동 뱃지" badges={["🏆 초보 수학 마스터"]} />
				{/* 관심 분야 / 가입일 */}
				<InfoBlock title="관심 분야" tags={profile.interests} />
				<InfoBlock
					title="가입일"
					content={profile.created_at.toString().slice(0, 10)}
				/>
			</div>
		</>
	);
}
