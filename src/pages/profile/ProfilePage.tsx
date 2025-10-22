import ProfileCard from "./ProfileCard";
import DetailCard from "./DetailCard";
import { useParams } from "react-router";
import { useProfileStore } from "../../stores/profileStore";
import { useEffect, useState } from "react";
import ProfileCadeSkeleton from "../../components/loading/profile/ProfileCadeSkeleton";
import DetailCardSkeleton from "../../components/loading/profile/DetailCardSkeleton";
import { useActPostStore } from "../../stores/profileActivityStore";

export default function ProfilePage() {
	const {
		profile,
		currentUserId,
		fetchProfile,
		fetchCurrentUserId,
		loading,
		error,
	} = useProfileStore();
	const { fetchUserPosts, fetchUserCommentsWithPosts } = useActPostStore();
	const { id } = useParams();

	const [ready, setReady] = useState(false);

	// 현재 유저 ID 로드
	useEffect(() => {
		if (!currentUserId) {
			fetchCurrentUserId().finally(() => setReady(true));
		} else {
			setReady(true);
		}
	}, [currentUserId, fetchCurrentUserId]);

	// profile / posts / comments fetch
	useEffect(() => {
		if (!ready || !currentUserId) return;

		const targetAuthId = id === "me" ? currentUserId : id;

		fetchProfile(targetAuthId);
		fetchUserPosts(targetAuthId);
		fetchUserCommentsWithPosts(targetAuthId);
	}, [
		ready,
		id,
		currentUserId,
		fetchProfile,
		fetchUserPosts,
		fetchUserCommentsWithPosts,
	]);

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
					<ProfileCard key={profile.auth_id} profile={profile} />
				</div>

				{/* 오른쪽 상세 정보 */}
				<div className="flex-1 space-y-[21px]">
					<DetailCard key={profile.auth_id} />
				</div>
			</div>
		</div>
	);
}
