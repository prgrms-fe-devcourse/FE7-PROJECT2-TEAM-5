import { Link } from "react-router";
import { useProfileStore } from "../../stores/profileStore";
import { getAge } from "../../utils/getAge";
import { getGrade } from "../../utils/getGrade";
import { useEffect } from "react";
import basicImage from "../../assets/basic_image.png";
import { SquarePen } from "lucide-react";
import ProfileCadeSkeleton from "../../components/loading/profile/ProfileCadeSkeleton";

type Props = {
	isMyProfile?: boolean;
	targetAuthId?: string | null;
};

export default function ProfileCard({
	isMyProfile = false,
	targetAuthId,
}: Props) {
	const { profile, fetchProfile, loading, error, userId } = useProfileStore();

	useEffect(() => {
		if (isMyProfile) {
			// 내 프로필이면 인자 없이 호출
			fetchProfile();
		} else if (profile?.auth_id) {
			fetchProfile(targetAuthId ?? null); // 다른 사람 프로필
		}
	}, [fetchProfile, isMyProfile, profile?.auth_id]);

	if (loading) return <ProfileCadeSkeleton />;
	if (error) return <p>❌ error 오류: {error}</p>;
	if (!profile || !userId) return <p>로그인이 필요합니다.</p>;

	const age = profile.birth_date ? getAge(profile.birth_date) : 0;
	const grade = profile.role === "student" ? getGrade(age) : "";

	const roleMap: Record<string, string> = {
		student: "학생",
		teacher: "선생님",
		parent: "학부모",
	};

	return (
		// 왼쪽 영역 - 프로필 카드
		<div className="flex flex-col items-center relative">
			{/* 프로필 이미지 영역 */}
			<div className="z-99 w-30 h-30">
				<div className="relative w-full h-full rounded-xl cursor-pointer">
					<img
						className="img w-full h-full rounded-xl object-cover"
						src={profile.profile_image_url ?? basicImage}
						alt="profile"
					/>
					{isMyProfile && (
						<div className="absolute top-0 left-0 w-full h-full rounded-xl bg-[rgba(0,0,0,0.4)] bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-medium transition-opacity">
							<label htmlFor="profile_img">
								<SquarePen size={24} />
							</label>
							<input
								id="profile_img"
								type="file"
								accept="image/*"
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
							/>
						</div>
					)}
				</div>
			</div>
			{/* 텍스트 컨텐츠 */}
			<div className="flex flex-col items-center absolute w-full bg-white top-15 rounded-xl shadow-xl pt-15 pb-10">
				{/* 이름 및 뱃지 */}
				<div className="flex flex-col items-center pt-6">
					<div className="text-sm font-medium text-gray-800">
						{/* 🏆 초보 수학 마스터 */}
					</div>
					<div className="text-3xl font-bold text-gray-800 mt-1">
						{profile.nickname}
					</div>
					<div className="text-base font-normal text-gray-500 mt-2.5">
						{roleMap[profile.role] || "알 수 없음"}
						{profile.role === "parent" ? "" : " · "}
						{grade ? `${grade}` : ""}
						{profile.role === "teacher" ? `${profile.major}` : ""}
					</div>
				</div>

				{/* 본인 프로필일 때만 수정 버튼 */}
				{isMyProfile && (
					<Link
						to={`/profile/me/edit`}
						className="bg-violet-500 rounded-xl text-center mt-5 px-4 py-2 cursor-pointer text-base font-normal text-white"
					>
						프로필 수정
					</Link>
				)}

				{/* 친구/게시글/댓글 통계 */}
				<div className="flex justify-between gap-[50px] pt-6">
					{/* 친구 통계 */}
					<div className="flex flex-col items-center">
						<div className="text-xl font-medium text-violet-500">
							7
						</div>
						<div className="text-sm font-medium text-gray-500">
							친구
						</div>
					</div>

					{/* 게시글 통계 */}
					<div className="flex flex-col items-center">
						<div className="text-xl font-medium text-violet-500">
							120
						</div>
						<div className="text-sm font-medium text-gray-500">
							게시글
						</div>
					</div>

					{/* 댓글 통계 */}
					<div className="flex flex-col items-center">
						<div className="text-xl font-medium text-violet-500">
							67
						</div>
						<div className="text-sm font-medium text-gray-500">
							댓글
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
