import { create } from "zustand";
import supabase from "../utils/supabase";
import type { BadgeLog } from "../types/badge";

interface BadgeStore {
	badges: BadgeLog[];
	representativeBadge: BadgeLog | null;
	loading: boolean;

	recentlyGranted: BadgeLog;
	setRecentlyGranted: (badge: BadgeLog | null) => void;

	// 유저 뱃지 목록
	fetchUserBadges: (userId: string | undefined) => Promise<void>;
	// 유저 대표 뱃지 설정
	setRepresentativeBadge: (
		userId: string | undefined,
		badgeLogId: string | undefined | null,
	) => Promise<void>;
}

export const useBadgeStore = create<BadgeStore>((set) => ({
	badges: [],
	representativeBadge: null,
	loading: false,

	recentlyGranted: null,
	setRecentlyGranted: (badge) => set({ recentlyGranted: badge }),

	// 유저 뱃지 목록 조회
	fetchUserBadges: async (userId) => {
		if (!userId) return;
		set({ loading: true });

		const { data: badgeLogsData, error: badgeLogsError } = await supabase
			.from("badge_logs")
			.select(
				`*,
				badges!inner (
					id,
					name,
					description,
					icon_url
				)
			`,
			)
			.eq("user_id", userId);

		if (badgeLogsError) {
			console.error("Failed to fetch badge logs:", badgeLogsError);
			set({ loading: false });
			return;
		}

		const badgeLogs: BadgeLog[] = (badgeLogsData || []).map((log) => ({
			id: log.id,
			user_id: log.user_id,
			badge_id: log.badge_id,
			created_at: log.created_at,
			badges: log.badges
				? {
						id: log.badges.id,
						name: log.badges.name ?? "",
						description: log.badges.description ?? "",
						icon_url: log.badges.icon_url ?? "",
						created_at: log.created_at,
					}
				: undefined,
		}));

		// 대표 뱃지 처리
		let representativeBadge: BadgeLog = null;
		const { data: user, error: userError } = await supabase
			.from("users")
			.select("representative_badge_id")
			.eq("auth_id", userId)
			.single();

		if (!userError && user?.representative_badge_id) {
			const { data: repBadgeData, error: repBadgeError } = await supabase
				.from("badge_logs")
				.select(
					`
				id,
				user_id,
				badge_id,
				created_at,
				badges (
					id,
					name,
					description,
					icon_url
				)
			`,
				)
				.eq("id", user.representative_badge_id)
				.single();

			if (!repBadgeError && repBadgeData) {
				representativeBadge = {
					id: repBadgeData.id,
					user_id: repBadgeData.user_id,
					badge_id: repBadgeData.badge_id,
					created_at: repBadgeData.created_at,
					badges: repBadgeData.badges as BadgeLog["badges"], // 여기서 타입 단언
				};
			}
		}

		set({
			badges: badgeLogs,
			representativeBadge,
			loading: false,
		});
	},

	// 유저 대표 뱃지 변경
	setRepresentativeBadge: async (userId, badgeLogId) => {
		const { error } = await supabase
			.from("users")
			.update({ representative_badge_id: badgeLogId })
			.eq("auth_id", userId);

		if (error) {
			console.error("Failed to set representative badge:", error);
			return;
		}

		await useBadgeStore.getState().fetchUserBadges(userId);
	},
}));
