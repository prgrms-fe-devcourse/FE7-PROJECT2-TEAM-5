import { useParams } from "react-router";
import { getAge } from "../../utils/getAge";
import { getGrade } from "../../utils/getGrade";
import InfoBlock from "./InfoBlock";

export default function Info({
	profile,
	childInfos,
}: {
	profile: UserProfile;
	childInfos: ChildInfo[];
}) {
	const isMe = "me" === useParams().id;
	const age = profile.birth_date ? getAge(profile.birth_date) : 0;
	const grade = profile.role === "student" ? getGrade(age) : "";

	return (
		<>
			<div>
				{/* 정보 헤더 */}
				<h3 className="text-xl font-bold text-violet-500 pb-2">
					개인 정보
				</h3>
				<p className="font-medium text-sm">{profile.bio}</p>
			</div>

			{/* 정보 그리드 */}
			<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
				{profile.role === "student" ? (
					<>
						{/* 성별 / 나이 */}
						<InfoBlock title="성별" content={profile.gender} />
						<InfoBlock title="나이" content={age} />
						{/* 학년 / 지역 */}
						<InfoBlock title="학년" content={grade} />
						<InfoBlock title="지역" content={profile.region} />
						{/* 취미 / 활동 뱃지 */}
						<InfoBlock
							title="취미"
							content={profile.habits
								?.join("")
								.split(",")
								.join(", ")}
						/>
						<InfoBlock
							title="활동 뱃지"
							badges={["🏆 초보 수학 마스터"]}
						/>
						{/* 관심 분야 / 가입일 */}
						<InfoBlock title="관심 분야" tags={profile.interests} />
						<InfoBlock
							title="가입일"
							content={profile.created_at.toString().slice(0, 10)}
						/>
						{/* 학생일 때, 보임 */}
						{isMe && (
							<InfoBlock
								title="자녀 코드"
								content={profile.child_link_code}
							/>
						)}
					</>
				) : (
					<>
						{/* 성별 / 자녀 */}
						<InfoBlock title="성별" content={profile.gender} />
						{childInfos ? (
							<InfoBlock title="자녀" childList={childInfos} />
						) : (
							<InfoBlock title="자녀" content="자녀 없음" />
						)}

						{/* 지역 / 전공 과목 */}
						<InfoBlock title="지역" content={profile.region} />
						{profile.role === "teacher" && (
							<>
								<InfoBlock
									title="전공 과목"
									content={profile.major}
								/>
								{/* 경력 / 활동 뱃지 */}
								<InfoBlock
									title="경력"
									content={profile.experience}
								/>
								<InfoBlock
									title="활동 뱃지"
									badges={["🏆 초보 수학 마스터"]}
								/>
							</>
						)}
						{/* 관심 분야 / 가입일 */}
						<InfoBlock title="관심 분야" tags={profile.interests} />
						<InfoBlock
							title="가입일"
							content={profile.created_at.toString().slice(0, 10)}
						/>
					</>
				)}
			</div>
		</>
	);
}
