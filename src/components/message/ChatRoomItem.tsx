import type { ChatRoom } from "../types/message";

interface ChatRoomItemProps {
	room: ChatRoom;
	currentUserId: string;
	onSelect: (roomId: string) => void;
	isSelected: boolean;
}

export default function ChatRoomItem({
	room,
	currentUserId,
	onSelect,
	isSelected,
}: ChatRoomItemProps) {
	// 현재 사용자가 아닌 상대방 정보 가져오기
	const otherUserInfo =
		room.user1_id === currentUserId ? room.user2 : room.user1;

	// 마지막 메시지 시간 포맷팅
	const formatLastMessageTime = (dateString?: string): string => {
		if (!dateString) return "";

		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

		if (diffInHours < 24) {
			// 24시간 이내면 시간만 표시
			return date.toLocaleTimeString("ko-KR", {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else {
			// 24시간 이후면 날짜만 표시
			return date.toLocaleDateString("ko-KR", {
				month: "short",
				day: "numeric",
			});
		}
	};

	// 로그인한 사용자 기준, 읽지 않은 메시지가 있는지 확인
	const hasUnreadMessages =
		room.user1_id === currentUserId
			? !room.is_read_user1
			: !room.is_read_user2;

	return (
		<div
			className={`cursor-pointer flex flex-row p-4 items-center gap-3 hover:bg-[rgba(139,92,246,0.1)] transition-colors ${
				isSelected ? "bg-[rgba(139,92,246,0.1)]" : ""
			}`}
			onClick={() => onSelect(room.id)}
		>
			{/* 프로필 이미지 */}
			<div className="w-10 h-10 bg-[#D9D9D9] rounded-full overflow-hidden">
				{otherUserInfo?.profile_image_url ? (
					<img
						src={otherUserInfo.profile_image_url}
						alt={otherUserInfo.nickname}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
						{otherUserInfo?.nickname?.charAt(0) || "?"}
					</div>
				)}
			</div>

			{/* 채팅방 정보 */}
			<div className="flex-1 min-w-0">
				{/* 이름 */}
				<div className="flex items-center gap-2">
					<span className="font-medium text-gray-900 truncate">
						{otherUserInfo?.nickname || "알 수 없음"}
					</span>
					{/* 읽지 않은 메시지 표시 (레드닷) */}
					{hasUnreadMessages && (
						<div className="bg-red-500 rounded-full w-2 h-2 animate-pulse flex-shrink-0"></div>
					)}
				</div>

				{/* 마지막 메시지 내용 */}
				{room.last_message && (
					<p className="text-sm text-gray-600 truncate mt-1">
						{room.last_message.message}
					</p>
				)}

				{/* 마지막 메시지 날짜 */}
				{room.last_message_at && (
					<span className="text-xs text-gray-500 mt-1 block">
						{formatLastMessageTime(room.last_message_at)}
					</span>
				)}
			</div>
		</div>
	);
}
