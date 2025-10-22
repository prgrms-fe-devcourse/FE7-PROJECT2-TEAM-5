import { useEffect } from "react";
import { useNotificationStore } from "../stores/notificationStore";
import { useProfileStore } from "../stores/profileStore";

export const useNotifications = () => {
	const currentUserId = useProfileStore((state) => state.currentUserId);
	const notifications = useNotificationStore((state) => state.notifications);
	const fetchNotifications = useNotificationStore(
		(state) => state.fetchNotifications,
	);

	// 알림 데이터 주기적 업데이트
	useEffect(() => {
		if (!currentUserId) return;

		// 즉시 로드
		fetchNotifications(currentUserId);

		// 30초마다 자동 업데이트
		const interval = setInterval(() => {
			fetchNotifications(currentUserId);
		}, 30000);

		return () => {
			clearInterval(interval);
		};
	}, [currentUserId, fetchNotifications]);

	return {
		notifications,
		fetchNotifications,
	};
};
