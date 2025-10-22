import { useState, useEffect, useCallback } from "react";
import { useProfileStore } from "../stores/profileStore";
import { getChatRooms } from "../utils/messageUtils";
import supabase from "../utils/supabase";
import type { ChatRoom } from "../types/message";

export const useUnreadMessages = () => {
	const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
	const currentUserId = useProfileStore((state) => state.currentUserId);

	// 읽지 않은 메시지가 있는지 확인하는 함수
	const checkUnreadMessages = useCallback(async () => {
		if (!currentUserId) {
			setHasUnreadMessages(false);
			return;
		}

		try {
			const chatRooms = await getChatRooms(currentUserId);

			// 현재 사용자에게 읽지 않은 메시지가 있는지 확인
			const hasUnread = chatRooms.some((room) => {
				const isUser1 = room.user1_id === currentUserId;
				return isUser1 ? !room.is_read_user1 : !room.is_read_user2;
			});

			setHasUnreadMessages(hasUnread);
		} catch (error) {
			console.error("읽지 않은 메시지 확인 실패:", error);
			setHasUnreadMessages(false);
		}
	}, [currentUserId]);

	// 초기 로드 시 읽지 않은 메시지 확인
	useEffect(() => {
		checkUnreadMessages();
	}, [checkUnreadMessages]);

	// 실시간으로 채팅방 업데이트 감지
	useEffect(() => {
		if (!currentUserId) return;

		const channel = supabase
			.channel(`unread_messages:${currentUserId}`)
			.on(
				"postgres_changes",
				{
					event: "UPDATE",
					schema: "public",
					table: "chat_rooms",
				},
				(payload) => {
					const updatedRoom = payload.new as ChatRoom;

					// 현재 사용자와 관련된 채팅방 업데이트만 처리
					if (
						updatedRoom.user1_id === currentUserId ||
						updatedRoom.user2_id === currentUserId
					) {
						checkUnreadMessages();
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [currentUserId, checkUnreadMessages]);

	return { hasUnreadMessages, checkUnreadMessages };
};
