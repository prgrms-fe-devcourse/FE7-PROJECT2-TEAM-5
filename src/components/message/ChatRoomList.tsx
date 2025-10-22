import type { ChatRoom } from "../../types/message";
import ChatRoomItem from "./ChatRoomItem";
import ChatRoomListSkeleton from "../loading/message/ChatRoomListSkeleton";

interface ChatRoomListProps {
	chatRooms: ChatRoom[];
	currentUserId: string;
	selectedRoomId: string | null;
	onRoomSelect: (roomId: string) => void;
	isLoading: boolean;
	isInitialLoad?: boolean;
}

export default function ChatRoomList({
	chatRooms,
	currentUserId,
	selectedRoomId,
	onRoomSelect,
	isLoading,
	isInitialLoad = false,
}: ChatRoomListProps) {
	// 스켈레톤 UI로 구현 예정
	if (isLoading && isInitialLoad) {
		return <ChatRoomListSkeleton />;
	}

	if (chatRooms.length === 0) {
		return (
			<div className="flex-1 overflow-y-auto">
				<div className="flex items-center justify-center h-32">
					<div className="text-gray-500 text-center">
						<div className="text-lg mb-2">💬</div>
						<div>아직 채팅방이 없습니다</div>
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
