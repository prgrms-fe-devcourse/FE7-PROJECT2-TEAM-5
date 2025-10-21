import supabase from "../utils/supabase";
import type { Message, ChatRoom } from "../types/message";

// 메시지 전송 함수 (chat_rooms 테이블 연동)
export const sendMessage = async (
	roomId: string,
	senderId: string,
	message: string,
): Promise<Message | null> => {
	try {
		// 1. 채팅방 정보 조회
		const { data: room, error: roomError } = await supabase
			.from("chat_rooms")
			.select("user1_id, user2_id")
			.eq("id", roomId)
			.single();

		if (roomError || !room) {
			console.error("채팅방 조회 실패:", roomError);
			return null;
		}

		// 2. 수신자 ID 확인
		const receiverId =
			room.user1_id === senderId ? room.user2_id : room.user1_id;

		// 3. 메시지 저장
		const { data, error } = await supabase
			.from("messages")
			.insert({
				sender_id: senderId,
				receiver_id: receiverId,
				message: message,
			})
			.select()
			.single();

		if (error) {
			console.error("메시지 전송 실패:", error);
			return null;
		}

		// 4. 채팅방 정보 업데이트
		const isUser1Sender = room.user1_id === senderId;
		await supabase
			.from("chat_rooms")
			.update({
				last_message_id: data.id,
				last_message_at: data.created_at,
				// 발신자는 읽음, 수신자는 읽지 않음으로 설정
				is_read_user1: isUser1Sender,
				is_read_user2: !isUser1Sender,
			})
			.eq("id", roomId);

		return data;
	} catch (error) {
		console.error("메시지 전송 중 오류:", error);
		return null;
	}
};

// 특정 채팅방의 메시지 조회 함수
export const getMessagesInRoom = async (roomId: string): Promise<Message[]> => {
	try {
		const { data, error } = await supabase
			.from("messages")
			.select("*")
			.eq("room_id", roomId)
			.order("created_at", { ascending: true });

		if (error) {
			console.error("메시지 조회 실패:", error);
			return [];
		}

		return data || [];
	} catch (error) {
		console.error("메시지 조회 중 오류:", error);
		return [];
	}
};

// 현재 사용자의 채팅방 목록 조회 함수
export const getChatRooms = async (
	currentUserId: string,
): Promise<ChatRoom[]> => {
	try {
		const { data, error } = await supabase
			.from("chat_rooms")
			.select(
				`
				*,
				user1:users!chat_rooms_user1_id_fkey(nickname, profile_image_url),
				user2:users!chat_rooms_user2_id_fkey(nickname, profile_image_url),
				last_message:messages!chat_rooms_last_message_id_fkey(message, created_at)
			`,
			)
			.or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
			.order("last_message_at", { ascending: false });

		if (error) {
			console.error("채팅방 목록 조회 실패:", error);
			return [];
		}

		return data || [];
	} catch (error) {
		console.error("채팅방 목록 조회 중 오류:", error);
		return [];
	}
};

// 채팅방 생성 함수
export const createChatRoom = async (
	user1Id: string,
	user2Id: string,
): Promise<ChatRoom | null> => {
	try {
		const { data, error } = await supabase
			.from("chat_rooms")
			.insert({
				user1_id: user1Id,
				user2_id: user2Id,
				is_read_user1: true,
				is_read_user2: true,
			})
			.select()
			.single();

		if (error) {
			console.error("채팅방 생성 실패:", error);
			return null;
		}

		return data;
	} catch (error) {
		console.error("채팅방 생성 중 오류:", error);
		return null;
	}
};

// 채팅방 읽음 처리 함수
export const markRoomAsRead = async (
	roomId: string,
	userId: string,
): Promise<void> => {
	try {
		const { data: room, error: roomError } = await supabase
			.from("chat_rooms")
			.select("user1_id, user2_id")
			.eq("id", roomId)
			.single();

		if (roomError || !room) return;

		const isUser1 = room.user1_id === userId;
		const updateField = isUser1 ? "is_read_user1" : "is_read_user2";

		await supabase
			.from("chat_rooms")
			.update({ [updateField]: true })
			.eq("id", roomId);
	} catch (error) {
		console.error("채팅방 읽음 처리 실패:", error);
	}
};
