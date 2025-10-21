import ProfileCard from "./ProfileCard";
import DetailCard from "./DetailCard";
import { useParams } from "react-router";
import { useProfileStore } from "../../stores/profileStore";
import { useEffect } from "react";
import ProfileCadeSkeleton from "../../components/loading/profile/ProfileCadeSkeleton";
import DetailCardSkeleton from "../../components/loading/profile/DetailCardSkeleton";

export default function ProfilePage() {
	const {
		profile,
		currentUserId,
		fetchProfile,
		fetchCurrentUserId,
		loading,
		error,
	} = useProfileStore();
	const { id } = useParams();

	useEffect(() => {
		if (!currentUserId) {
			fetchCurrentUserId();
		}
	}, [currentUserId, fetchCurrentUserId]);

	useEffect(() => {
		if (!id || !currentUserId) return;

		const targetAuthId = id === "me" ? currentUserId : id;
		fetchProfile(targetAuthId);
	}, [id, currentUserId, fetchProfile]);

	// 로딩 중
	if (loading || !profile)
		return (
			<div className="mx-auto w-[1024px]">
				<div className="flex flex-row gap-10 w-full">
					{/* 왼쪽 프로필 카드 */}
					<div className="w-[270px]">
						<ProfileCadeSkeleton profile={profile} />
					</div>

					{/* 오른쪽 상세 정보 */}
					<div className="flex-1 space-y-[21px]">
						<DetailCardSkeleton />
					</div>
				</div>
			</div>
		);

	// 에러
	if (error) return <p>오류: {error}</p>;

	return (
		<div className="mx-auto w-[1024px]">
			<div className="flex flex-row gap-10 w-full">
				{/* 왼쪽 프로필 카드 */}
				<div className="w-[270px]">
					<ProfileCard
						key={profile.auth_id} // URL 변경 시 재렌더링
						profile={profile}
					/>
				</div>

				{/* 오른쪽 상세 정보 */}
				<div className="flex-1 space-y-[21px]">
					<DetailCard key={profile.auth_id} />
				</div>
			</div>
		</div>
	);
}
