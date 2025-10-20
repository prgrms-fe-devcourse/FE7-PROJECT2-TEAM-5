import { useEffect } from "react";
import { MessageCircle, Bell, Heart, UserPlus, ThumbsUp } from "lucide-react";
import type { Notification } from "../types/notification";
import { useNotificationStore } from "../stores/notificationStore";
import { useProfileStore } from "../stores/profileStore";

interface NotificationSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function NotificationSidebar({
	isOpen,
	onClose,
}: NotificationSidebarProps) {
	const currentUserId = useProfileStore((state) => state.currentUserId);
	const {
		notifications,
		isLoading,
		error,
		fetchNotifications,
		deleteNotification,
		clearError,
	} = useNotificationStore();

	// ESC 키로 사이드바 닫기
	useEffect(() => {
		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscapeKey);
		}

		return () => {
			document.removeEventListener("keydown", handleEscapeKey);
		};
	}, [isOpen, onClose]);

	// 알림 데이터 로드
	useEffect(() => {
		if (isOpen && currentUserId) {
			fetchNotifications(currentUserId);
		}
	}, [isOpen, currentUserId, fetchNotifications]);

	// 모두 삭제 (임시로 비활성화)
	const handleDeleteAll = () => {
		// TODO: 모두 삭제 기능
		console.log("모두 삭제 진행");
	};

	// 알림 클릭
	const handleNotificationClick = async (notification: Notification) => {
		// TODO: 해당 페이지로 이동하는 로직 구현
		console.log("알림 이동:", notification);

		// 알림 삭제
		await deleteNotification(notification.id);
	};

	// 알림 타입별로 아이콘 다르게 표시
	const getNotificationIcon = (type: string) => {
		switch (type) {
			case "NEW_COMMENT":
				return <MessageCircle className="w-5 h-5 text-[#8B5CF6]" />;
			case "NEW_REPLY":
				return <MessageCircle className="w-5 h-5 text-[#8B5CF6]" />;
			case "NEW_MESSAGE":
				return <MessageCircle className="w-5 h-5 text-[#8B5CF6]" />;
			case "POST_LIKE":
				return <Heart className="w-5 h-5 text-[#EA489A]" />;
			case "COMMENT_LIKE":
				return <Heart className="w-5 h-5 text-[#EA489A]" />;
			case "CHILD_LINKED":
				return <UserPlus className="w-5 h-5 text-[#10B981]" />;
			case "NEW_POST_BY_CHILD":
				return <Bell className="w-5 h-5 text-[#F59E0B]" />;
			case "COMMENT_ADOPTED":
				return <ThumbsUp className="w-5 h-5 text-[#8B5CF6]" />;
			default:
				return <Bell className="w-5 h-5 text-[#8B5CF6]" />;
		}
	};

	// 사이드바가 닫힌 상태면 렌더링 안함
	if (!isOpen) return null;

	return (
		<>
			{/* 오버레이 */}
			<div
				className="fixed inset-0 bg-gray-900/60 z-40"
				onClick={onClose}
			/>

			{/* 사이드바 */}
			<div className="fixed right-0 top-0 w-[440px] h-screen bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
				{/* 헤더 */}
				<div className="flex justify-between items-center p-6 border-b border-[#E6E9EE]">
					<h2 className="text-xl font-bold text-[#1F2937]">알림</h2>
					<button
						onClick={handleDeleteAll}
						className="text-sm text-[#6B7280] hover:text-[#8B5CF6] transition-colors"
					>
						모두 삭제
					</button>
				</div>

				{/* 알림 목록 */}
				<div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
					{error && (
						<div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
							<p className="font-medium">에러</p>
							<p>{error}</p>
							<button
								onClick={clearError}
								className="mt-2 text-xs underline hover:no-underline"
							>
								닫기
							</button>
						</div>
					)}

					{isLoading ? (
						<div className="flex flex-col items-center justify-center h-64 text-[#6B7280]">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5CF6] mb-4"></div>
							<p>알림을 불러오는 중...</p>
						</div>
					) : notifications.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-64 text-[#6B7280]">
							<Bell className="w-12 h-12 mb-4 opacity-50" />
							<p>알림이 없습니다!</p>
						</div>
					) : (
						notifications.map((notification) => (
							<div
								key={notification.id}
								className="p-4 rounded-lg border bg-white border-[#E6E9EE] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
								onClick={() =>
									handleNotificationClick(notification)
								}
							>
								<div className="flex items-start gap-3">
									<div className="flex-shrink-0 mt-1">
										{getNotificationIcon(notification.type)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-[#1F2937] mb-1">
											{notification.message}
										</p>
										{notification.content && (
											<p className="text-sm text-[#6B7280] mb-2 italic truncate">
												"{notification.content}"
											</p>
										)}
										<p className="text-xs text-[#9CA3AF]">
											{notification.date}
										</p>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</>
	);
}
