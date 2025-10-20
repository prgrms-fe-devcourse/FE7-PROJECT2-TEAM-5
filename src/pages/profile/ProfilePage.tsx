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

	// 로그인 유저 ID 먼저 가져오기
	useEffect(() => {
		fetchCurrentUserId();
	}, [fetchCurrentUserId]);

	useEffect(() => {
		if (!id) return;

		// "me"일 경우 로그인한 사용자만 가능
		if (id === "me") {
			if (!currentUserId) return; // 로그인 안했는데 /me면 접근 불가
			fetchProfile(currentUserId);
		} else {
			// 로그인 여부와 상관없이 특정 사용자 ID로 프로필 가져오기
			fetchProfile(id);
		}
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
