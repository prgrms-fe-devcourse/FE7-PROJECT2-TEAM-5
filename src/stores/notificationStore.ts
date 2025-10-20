import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";
import type { Notification } from "../types/notification";

type NotificationState = {
	notifications: Notification[];
	isLoading: boolean;
	error: string | null;

	// Actions
	fetchNotifications: (userId: string) => Promise<void>;
	deleteNotification: (notificationId: string) => Promise<void>;
	clearError: () => void;
};

export const useNotificationStore = create<NotificationState>()(
	immer((set) => ({
		notifications: [],
		isLoading: false,
		error: null,

		fetchNotifications: async (userId: string) => {
			set((state) => {
				state.isLoading = true;
				state.error = null;
			});

			try {
				const { data, error } = await supabase
					.from("notifications")
					.select(
						`
						id,
						type,
						message,
						created_at,
						actor_id,
						target_id,
						user_id
					`,
					)
					.eq("user_id", userId)
					.order("created_at", { ascending: false })
					.limit(50);

				if (error) throw error;

				// 데이터를 Notification 타입에 맞게 변환
				const formattedNotifications: Notification[] = (data || []).map(
					(item) => ({
						id: item.id,
						type: item.type as Notification["type"],
						message: item.message,
						date: new Date(item.created_at).toLocaleDateString(
							"ko-KR",
						),
						actorId: item.actor_id,
						targetId: item.target_id,
						createdAt: item.created_at,
					}),
				);

				set((state) => {
					state.notifications = formattedNotifications;
					state.isLoading = false;
				});
			} catch (err) {
				console.error("알림 로딩 오류:", err);
				set((state) => {
					state.error =
						err instanceof Error
							? err.message
							: "알림을 불러오는데 실패했습니다.";
					state.isLoading = false;
				});
			}
		},

		deleteNotification: async (notificationId: string) => {
			try {
				const { error } = await supabase
					.from("notifications")
					.delete()
					.eq("id", notificationId);

				if (error) throw error;

				set((state) => {
					state.notifications = state.notifications.filter(
						(n) => n.id !== notificationId,
					);
				});
			} catch (err) {
				console.error("알림 삭제 오류:", err);
				set((state) => {
					state.error =
						err instanceof Error
							? err.message
							: "알림 삭제에 실패했습니다.";
				});
			}
		},

		clearError: () => {
			set((state) => {
				state.error = null;
			});
		},
	})),
);
