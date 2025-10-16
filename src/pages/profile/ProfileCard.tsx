import { Link } from "react-router";
import { useProfileStore } from "../../stores/profileStore";
import { getAge } from "../../utils/getAge";
import { getGrade } from "../../utils/getGrade";
import { useEffect, useState } from "react";
import basicImage from "../../assets/basic_image.png";
import { SquarePen } from "lucide-react";
import ProfileCadeSkeleton from "../../components/loading/profile/ProfileCadeSkeleton";
import Modal from "../../components/Modal";

type Props = {
	isMyProfile?: boolean;
	targetAuthId?: string | null;
};

export default function ProfileCard({
	isMyProfile = false,
	targetAuthId,
}: Props) {
	const { profile, fetchProfile, loading, error, userId } = useProfileStore();

	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		if (isMyProfile) {
			// 내 프로필이면 인자 없이 호출
			fetchProfile();
		} else if (profile?.auth_id) {
			fetchProfile(targetAuthId ?? null); // 다른 사람 프로필
		}
	}, [fetchProfile, isMyProfile, profile?.auth_id]);

	if (loading) return <ProfileCadeSkeleton profile={profile} />;
	if (error) return <p>❌ error 오류: {error}</p>;
	if (!profile || !userId) return <p>로그인이 필요합니다.</p>;

	const age = profile.birth_date ? getAge(profile.birth_date) : 0;
	const grade = profile.role === "student" && getGrade(age);

	const roleMap: Record<string, string> = {
		student: "학생",
		teacher: "선생님",
		parent: "학부모",
	};

	const handleDeleteAccount = async () => {
		try {
			console.log("회원 탈퇴 처리 중...");
			// Supabase users 삭제 로직 추가 예정
			setIsModalOpen(false);
			alert("계정이 삭제되었습니다.");
		} catch (err) {
			console.error("탈퇴 실패:", err);
		}
	};

	return (
		<>
			{/* // 왼쪽 영역 - 프로필 카드 */}
			<div className="flex flex-col items-center relative">
				{/* 프로필 이미지 영역 */}
				<div className="z-10 w-30 h-30">
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
				<div className="flex flex-col items-center absolute w-full bg-white top-15 rounded-xl shadow-xl pt-21 pb-10 px-10">
					{/* 이름 및 뱃지 */}
					<div className="flex flex-col items-center">
						<div className="text-sm font-medium text-gray-800 mb-1">
							🏆 초보 수학 마스터
						</div>
						<div className="text-3xl font-bold text-gray-800 mb-2.5">
							{profile.nickname}
						</div>
						<div className="text-base font-normal text-gray-500 mb-5">
							{roleMap[profile.role] || "알 수 없음"}
							{profile.role === "parent" ? "" : " · "}
							{grade && `${grade}`}
							{profile.role === "teacher" && `${profile.major}`}
						</div>
					</div>

					{/* 본인 프로필일 때만 수정 버튼 */}
					{isMyProfile && (
						<Link
							to={`/profile/me/edit`}
							className="bg-violet-500 rounded-xl text-center px-4 py-2 cursor-pointer text-base font-normal text-white"
						>
							프로필 수정
						</Link>
					)}

					{/* 친구/게시글/댓글 통계 */}
					<div className="flex justify-between gap-12 pt-6">
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

					{/* 선생님 포인트 */}
					{profile.role === "teacher" ? (
						<div className="w-full rounded-xl mt-6 px-6 py-4 bg-violet-500 text-white space-y-1">
							<p>보유 포인트</p>
							<div className="flex flex-row items-end justify-between">
								<span className="text-xl font-medium">
									1000p
								</span>
								<span className="text-xs underline">
									내역보기
								</span>
							</div>
						</div>
					) : (
						""
					)}

					{isMyProfile && (
						<button onClick={() => setIsModalOpen(true)}>
							탈퇴하기
						</button>
					)}
				</div>
			</div>
			{/* 모달 컴포넌트 */}
			<Modal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title="회원 탈퇴"
			>
				<p className="text-gray-600 mb-5">
					정말로 이 친구를 삭제하시겠습니까?
					<br />이 작업은 되돌릴 수 없습니다.
				</p>
				<div className="flex justify-center gap-3">
					<button
						onClick={() => setIsModalOpen(false)}
						className="px-8 py-3 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
					>
						취소
					</button>
					<button
						onClick={handleDeleteAccount}
						className="px-8 py-3 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
					>
						삭제
					</button>
				</div>
			</Modal>
		</>
	);
}
