import type { ChatRoom } from "../types/message";
import ChatRoomItem from "./ChatRoomItem";

interface ChatRoomListProps {
	chatRooms: ChatRoom[];
	currentUserId: string;
	selectedRoomId: string | null;
	onRoomSelect: (roomId: string) => void;
	isLoading: boolean;
}

export default function ChatRoomList({
	chatRooms,
	currentUserId,
	selectedRoomId,
	onRoomSelect,
	isLoading,
}: ChatRoomListProps) {
	// 스켈레톤 UI로 구현 예정
	if (isLoading) {
		return (
			<div className="flex-1 overflow-y-auto">
				<div className="flex items-center justify-center h-32">
					<div className="text-gray-500">채팅방을 불러오는 중</div>
				</div>
			</div>
		);
	}

	if (chatRooms.length === 0) {
		return (
			<div className="flex-1 overflow-y-auto">
				<div className="flex items-center justify-center h-32">
					<div className="text-gray-500 text-center">
						<div className="text-lg mb-2">💬</div>
						<div>아직 채팅방이 없습니다</div>
						<div className="text-sm mt-1">
							사용자 목록에서 DM을 시작해보세요!
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto">
			{chatRooms.map((room) => (
				<ChatRoomItem
					key={room.id}
					room={room}
					currentUserId={currentUserId}
					onSelect={onRoomSelect}
					isSelected={selectedRoomId === room.id}
				/>
			))}
		</div>
	);
}
