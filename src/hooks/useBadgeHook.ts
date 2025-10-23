import supabase from "../utils/supabase";
import { useBadgeStore } from "../stores/badgeStore";

interface BadgeCondition {
	type: "comment" | "post";
	count: number;
	badgeId: string;
	badgeName: string;
}

// 조건 정의
const BADGE_CONDITIONS: BadgeCondition[] = [
	{
		type: "comment",
		count: 1,
		badgeId: "2e8302e6-a11d-48a6-ae69-216dc46c27de",
		badgeName: "소통자",
	},
	{
		type: "comment",
		count: 10,
		badgeId: "92c07455-cb6a-47f6-9cff-d35adecf8a65",
		badgeName: "배움의 등불",
	},
	{
		type: "post",
		count: 1,
		badgeId: "9d16d331-2d26-4c0b-bff7-72dfe2762905",
		badgeName: "개척자",
	},
];

export const checkAndGrantBadge = async (userId: string) => {
	// 유저 활동 수 조회
	const { count: commentCount } = await supabase
		.from("comments")
		.select("*", { count: "exact", head: true })
		.eq("user_id", userId);

	const { count: postCount } = await supabase
		.from("posts")
		.select("*", { count: "exact", head: true })
		.eq("user_id", userId);

	// 현재 유저가 가진 뱃지 조회
	const { data: currentBadgeLogs } = await supabase
		.from("badge_logs")
		.select("id, badge_id")
		.eq("user_id", userId);

	const ownedBadgeIds = currentBadgeLogs?.map((b) => b.badge_id) || [];

	// 조건에 맞는 뱃지 필터 (중복 방지)
	const badgesToGrant = BADGE_CONDITIONS.filter((condition) => {
		if (condition.type === "comment")
			return commentCount! >= condition.count;
		if (condition.type === "post") return postCount! >= condition.count;
		return false;
	}).filter((b) => !ownedBadgeIds.includes(b.badgeId));

	// badge_logs 삽입 및 alert + 최근 획득 상태 업데이트
	for (const badge of badgesToGrant) {
		const { data: insertedData, error } = await supabase
			.from("badge_logs")
			.insert([{ user_id: userId, badge_id: badge.badgeId }])
			.select()
			.single();

		if (error) {
			console.error("Failed to grant badge:", error);
		} else if (insertedData) {
			// alert로 뱃지 획득 표시
			alert(`🎉 새 뱃지 획득! ${badge.badgeName}`);
			// Zustand 최근 획득 뱃지 상태 업데이트
			useBadgeStore.getState().setRecentlyGranted(insertedData);
		}
	}

	// Zustand 상태 전체 업데이트
	await useBadgeStore.getState().fetchUserBadges(userId);
};
