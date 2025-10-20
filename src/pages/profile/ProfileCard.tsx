import { Link, useNavigate } from "react-router";
import { useProfileStore } from "../../stores/profileStore";
import { getAge } from "../../utils/getAge";
import { getGrade } from "../../utils/getGrade";
import { useMemo, useState } from "react";
import basicImage from "../../assets/basic_image.png";
import { SquarePen, Trash2 } from "lucide-react";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import type { UserProfile } from "../../types/profile";
import supabase from "../../utils/supabase";

type Props = {
	profile: UserProfile | null;
};

export default function ProfileCard({ profile }: Props) {
	const navigate = useNavigate();
	const { deleteProfile, currentUserId } = useProfileStore();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isImgModalOpen, setIsImgModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);

	const [imgFile, setImgFile] = useState<string | null>(null);

	if (!profile) return null;

	// 현재 보고 있는 프로필이 내 프로필인지 판별
	const isMyProfile = useMemo(
		() => profile.auth_id === currentUserId,
		[profile, currentUserId],
	);

	const age = profile.birth_date ? getAge(profile.birth_date) : 0;
	const grade = profile.role === "student" && getGrade(age);

	const roleMap: Record<string, string> = {
		student: "학생",
		teacher: "선생님",
		parent: "학부모",
	};

	const handleDeleteAccount = async () => {
		setIsDeleting(true);
		try {
			await deleteProfile();
			setIsDeleteModalOpen(false);
			navigate("/");
		} catch (err) {
			console.error("탈퇴 실패:", err);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleImgFileUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = e.target.files && e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				setImgFile(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsUpdating(true);

		if (!imgFile) {
			console.error("이미지 URL이 비어 있습니다.");
			return;
		}

		try {
			const { error } = await supabase
				.from("users")
				.update({ profile_image_url: imgFile })
				.eq("auth_id", profile.auth_id);

			if (error) throw error;

			console.log("프로필 이미지 URL 업데이트 완료:", imgFile);
			alert("프로필 이미지가 업데이트되었습니다!");
			setIsImgModalOpen(false);
		} catch (err) {
			console.error("이미지 URL 등록 실패:", err);
			alert("이미지 URL 저장 중 오류가 발생했습니다.");
		} finally {
			setIsUpdating(false);

			// 페이지 새로고침
			window.location.reload();
		}
	};

	return (
		<>
			{/* // 왼쪽 영역 - 프로필 카드 */}
			<div className="flex flex-col items-center relative">
				{/* 프로필 이미지 영역 */}
				<div className="z-10 w-30 h-30">
					<div className="relative w-full h-full rounded-xl">
						<img
							className="img w-full h-full rounded-xl object-cover"
							src={profile.profile_image_url ?? basicImage}
							alt="profile"
						/>
						{isMyProfile && (
							<>
								<Button
									onClick={() => setIsImgModalOpen(true)}
									className="cursor-pointer absolute top-0 left-0 w-full h-full rounded-xl bg-[rgba(0,0,0,0.4)] bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-medium transition-opacity"
								>
									<SquarePen size={24} />
								</Button>
								<Modal
									isOpen={isImgModalOpen}
									onClose={() => setIsImgModalOpen(false)}
									title="프로필 수정"
								>
									<form method="post" onSubmit={handleSubmit}>
										<input
											id="profile_img"
											type="file"
											accept="image/*"
											name="profileImg"
											onChange={handleImgFileUpload}
											className="border"
										/>
										<div className="flex justify-center gap-3">
											{isUpdating ? (
												""
											) : (
												<>
													<Button
														onClick={() =>
															setIsImgModalOpen(
																false,
															)
														}
														className="px-8 py-3 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
													>
														취소
													</Button>
												</>
											)}

											<Button
												disabled={isUpdating}
												className="px-8 py-3 rounded-md bg-violet-500 text-white hover:bg-violet-600 transition-colors"
											>
												{isUpdating
													? "수정 중..."
													: "수정"}
											</Button>
										</div>
									</form>
								</Modal>
							</>
						)}
					</div>
				</div>
				{/* 텍스트 컨텐츠 */}
				<div className="flex flex-col items-center absolute w-full bg-white top-15 rounded-xl shadow-xl pt-21 pb-10 px-10">
					{/* 이름 및 뱃지 */}
					<div className="flex flex-col items-center text-center">
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
					{isMyProfile ? (
						<Link
							to={`/profile/me/edit`}
							className="bg-violet-500 rounded-xl text-center px-4 py-2 cursor-pointer text-base font-normal text-white"
						>
							프로필 수정
						</Link>
					) : (
						<div className="flex flex-row gap-2">
							<Button className="w-1/2 bg-violet-500 rounded-xl text-center px-4 py-2 cursor-pointer text-base font-normal text-white">
								팔로우
							</Button>
							<Button className="w-1/2 bg-violet-500 rounded-xl text-center px-4 py-2 cursor-pointer text-base font-normal text-white">
								메시지
							</Button>
						</div>
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
							<span className="text-xl font-medium">
								{profile.current_point} point
							</span>
						</div>
					) : (
						""
					)}

					{isMyProfile && (
						<Button
							className="absolute left-10 bottom-[-70px] px-4 py-2 bg-red-400 text-white rounded hover:bg-red-600"
							onClick={() => setIsDeleteModalOpen(true)}
						>
							<Trash2 />
						</Button>
					)}
				</div>
			</div>
			{/* 모달 컴포넌트 */}
			<Modal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				title="회원 탈퇴"
			>
				<p className="text-gray-600 mb-5">
					정말로 이 계정를 삭제하시겠습니까?
					<br />이 작업은 되돌릴 수 없습니다.
				</p>
				<div className="flex justify-center gap-3">
					{isDeleting ? (
						""
					) : (
						<>
							<Button
								onClick={() => setIsDeleteModalOpen(false)}
								className="px-8 py-3 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
							>
								취소
							</Button>
						</>
					)}

					<Button
						onClick={handleDeleteAccount}
						disabled={isDeleting}
						className="px-8 py-3 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
					>
						{isDeleting ? "삭제 중..." : "삭제"}
					</Button>
				</div>
			</Modal>
		</>
	);
}
