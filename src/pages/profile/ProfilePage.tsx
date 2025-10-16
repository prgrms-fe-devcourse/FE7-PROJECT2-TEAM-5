import ProfileCard from "./ProfileCard";
import DetailCard from "./DetailCard";
import { useParams } from "react-router";
import { useProfileStore } from "../../stores/profileStore";
import { useEffect } from "react";
import ProfileCadeSkeleton from "../../components/loading/profile/ProfileCadeSkeleton";
import DetailCardSkeleton from "../../components/loading/profile/DetailCardSkeleton";

export default function ProfilePage() {
	const { id } = useParams();
	const { userId, profile, fetchProfile, loading, error } = useProfileStore();

	const isMyProfile = id === "me" || id === userId;
	const targetAuthId = !isMyProfile ? id : undefined;

	useEffect(() => {
		fetchProfile(targetAuthId ?? null);
	}, [fetchProfile, targetAuthId]);

	if (loading)
		return (
			<>
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
			</>
		);

	if (error) return <p>❌ 오류: {error}</p>;

	return (
		<div className="mx-auto w-[1024px]">
			<div className="flex flex-row gap-10 w-full">
				{/* 왼쪽 프로필 카드 */}
				<div className="w-[270px]">
					<ProfileCard isMyProfile={isMyProfile} />
				</div>

				{/* 오른쪽 상세 정보 */}
				<div className="flex-1 space-y-[21px]">
					<DetailCard />
				</div>
			</div>
		</div>
	);
}
