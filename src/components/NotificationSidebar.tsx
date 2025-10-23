import { useEffect } from "react";
import { useNavigate } from "react-router";
import {
	MessageCircle,
	Bell,
	Heart,
	UserPlus,
	ThumbsUp,
	Trash2,
} from "lucide-react";
import type { Notification } from "../types/notification";
import { useNotificationStore } from "../stores/notificationStore";
import { useProfileStore } from "../stores/profileStore";
import NotificationSkeleton from "./loading/NotificationSkeleton";

interface NotificationSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function NotificationSidebar({
	isOpen,
	onClose,
}: NotificationSidebarProps) {
	const navigate = useNavigate();
	const currentUserId = useProfileStore((state) => state.currentUserId);
	const {
		notifications,
		isLoading,
		error,
		fetchNotifications,
		deleteNotification,
		deleteAllNotifications,
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

	// 모두 삭제
	const handleDeleteAll = async () => {
		if (!currentUserId) return;

		if (confirm("모든 알림을 삭제하시겠습니까?")) {
			await deleteAllNotifications(currentUserId);
		}
	};

	// 개별 알림 삭제
	const handleDeleteNotification = async (
		e: React.MouseEvent,
		notification: Notification,
	) => {
		e.stopPropagation(); // 알림 클릭 이벤트 방지
		await deleteNotification(notification.id);
	};

	// 알림 클릭
	const handleNotificationClick = async (notification: Notification) => {
		// 알림 타입별 페이지 이동 로직
		switch (notification.type) {
			case "CHILD_LINKED":
				// 부모의 프로필 페이지로 이동
				navigate(`/profile/${notification.targetId}`);
				onClose();

				break;

			case "NEW_POST_BY_CHILD":
				// 자녀가 작성한 게시글 페이지로 이동
				navigate(`/posts/${notification.targetId}`);
				onClose();
				break;

			case "COMMENT_ADOPTED":
				// 채택된 댓글이 있는 게시글 페이지로 이동
				navigate(`/posts/${notification.targetId}`);
				onClose();
				break;

			case "COMMENT_LIKE":
				// 좋아요 받은 댓글이 있는 게시글 페이지로 이동
				navigate(`/posts/${notification.targetId}`);
				onClose();
				break;

			case "NEW_COMMENT":
				// 새 댓글이 달린 게시글 페이지로 이동
				navigate(`/posts/${notification.targetId}`);
				onClose();
				break;

			case "POST_LIKE":
				// 좋아요 받은 게시글 페이지로 이동
				navigate(`/posts/${notification.targetId}`);
				onClose();
				break;

			case "NEW_REPLY":
				// 답글이 달린 댓글이 있는 게시글 페이지로 이동
				navigate(`/posts/${notification.targetId}`);
				onClose();
				break;

			default:
				console.log("알 수 없는 알림 타입:", notification.type);
		}

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
						className="text-sm text-[#6B7280] hover:text-[#8B5CF6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						disabled={notifications.length === 0}
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
						<NotificationSkeleton />
					) : notifications.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-64 text-[#6B7280]">
							<Bell className="w-12 h-12 mb-4 opacity-50" />
							<p>알림이 없습니다!</p>
						</div>
					) : (
						notifications.map((notification) => (
							<div
								key={notification.id}
								className="group relative p-4 rounded-lg border bg-white border-[#E6E9EE] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
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

								{/* 호버 시 나타나는 삭제 버튼 */}
								<div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
									<button
										onClick={(e) =>
											handleDeleteNotification(
												e,
												notification,
											)
										}
										className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-red-500/20 transition-colors duration-200 group/delete cursor-pointer"
									>
										<Trash2 className="w-4 h-4 text-[#6B7280] group-hover/delete:text-red-500 transition-colors duration-200" />
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</>
	);
}
