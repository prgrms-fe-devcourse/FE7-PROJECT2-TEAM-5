import { useState, useEffect } from "react";
import { MessageCircle, Bell, Heart, UserPlus, ThumbsUp } from "lucide-react";
import type { Notification } from "../types/notification";

// 임시 알림 데이터
const mockNotifications: Notification[] = [
	{
		id: "1",
		type: "NEW_COMMENT",
		message: "누군가 댓글을 달았습니다.",
		content: "저도 이 방법으로 풀었어요!",
		date: "2025.09.25",
		isRead: false,
		actorId: "user1",
		targetId: "post1",
		createdAt: "2025-09-25T10:30:00Z",
	},
	{
		id: "2",
		type: "NEW_MESSAGE",
		message: "메시지가 도착했습니다.",
		content:
			"안녕하세요~ @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
		date: "2025.09.27",
		isRead: false,
		actorId: "user2",
		targetId: "message1",
		createdAt: "2025-09-27T14:20:00Z",
	},
	{
		id: "3",
		type: "POST_LIKE",
		message: "누군가 게시글에 좋아요를 눌렀습니다.",
		date: "2025.09.28",
		isRead: true,
		actorId: "user3",
		targetId: "post2",
		createdAt: "2025-09-28T09:15:00Z",
	},
	{
		id: "4",
		type: "CHILD_LINKED",
		message: "@@님이 회원님을 자식으로 등록했습니다",
		date: "2025.09.29",
		isRead: true,
		actorId: "user4",
		targetId: "child1",
		createdAt: "2025-09-29T16:45:00Z",
	},
	{
		id: "5",
		type: "COMMENT_LIKE",
		message: "누군가 댓글에 좋아요를 눌렀습니다.",
		content:
			"정말 도움이 되는 댓글이에요! @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
		date: "2025.09.30",
		isRead: false,
		actorId: "user5",
		targetId: "comment1",
		createdAt: "2025-09-30T11:30:00Z",
	},
	{
		id: "6",
		type: "NEW_REPLY",
		message: "댓글에 답글이 달렸습니다.",
		content: "감사합니다!",
		date: "2025.10.01",
		isRead: false,
		actorId: "user6",
		targetId: "reply1",
		createdAt: "2025-10-01T13:20:00Z",
	},
];

interface NotificationSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function NotificationSidebar({
	isOpen,
	onClose,
}: NotificationSidebarProps) {
	const [notifications, setNotifications] =
		useState<Notification[]>(mockNotifications);

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

	// 모두 삭제
	const handleDeleteAll = () => {
		setNotifications([]);
	};

	// 알림 클릭
	const handleNotificationClick = (notification: Notification) => {
		// 기능 구현 시 해당 페이지로 이동하고 DB에서 알림 삭제
		console.log("알림 이동:", notification);

		// 임시로 클릭한 알림을 목록에서 제거
		setNotifications((prev) =>
			prev.filter((n) => n.id !== notification.id),
		);
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
			<div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
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
				<div className="flex-1 overflow-y-auto p-4 space-y-3">
					{notifications.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-64 text-[#6B7280]">
							<Bell className="w-12 h-12 mb-4 opacity-50" />
							<p>알림이 없습니다</p>
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
