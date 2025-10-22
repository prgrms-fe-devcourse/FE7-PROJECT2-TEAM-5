import { useState, useEffect, useCallback } from "react";
import { useProfileStore } from "../stores/profileStore";
import supabase from "../utils/supabase";
import {
	sendMessage,
	getMessagesInRoom,
	getChatRooms,
	findExistingChatRoom,
	createChatRoom,
	markRoomAsRead,
	subscribeToMessages,
	subscribeToChatRooms,
} from "../utils/messageUtils";
import type { ChatRoom, Message } from "../types/message";

// 메시지 전송을 위한 훅
export const useSendMessage = () => {
	const [isLoading, setIsLoading] = useState(false);

	const sendMessageHandler = useCallback(
		async (roomId: string, message: string) => {
			setIsLoading(true);
			try {
				const currentUserId = useProfileStore.getState().currentUserId;
				if (!currentUserId) return null;

				const result = await sendMessage(
					roomId,
					currentUserId,
					message,
				);
				return result;
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	return { sendMessage: sendMessageHandler, isLoading };
};

// 특정 채팅방의 메시지 조회를 위한 훅
export const useMessagesInRoom = (roomId: string | null) => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const currentUserId = useProfileStore((state) => state.currentUserId);

	const fetchMessages = useCallback(async () => {
		if (!roomId) return;

		setIsLoading(true);
		try {
			const fetchedMessages = await getMessagesInRoom(roomId);
			setMessages(fetchedMessages);
		} finally {
			setIsLoading(false);
		}
	}, [roomId]);

	useEffect(() => {
		fetchMessages();
	}, [fetchMessages]);

	// 실시간 메시지 구독
	useEffect(() => {
		if (!roomId) return;

		const channel = subscribeToMessages(roomId, (newMessage) => {
			setMessages((prev) => [...prev, newMessage]);
		});

		return () => {
			supabase.removeChannel(channel);
		};
	}, [roomId]);

	// 채팅방 진입 시 읽음 처리
	useEffect(() => {
		if (!roomId || !currentUserId) return;

		const markAsRead = async () => {
			await markRoomAsRead(roomId, currentUserId);
		};

		markAsRead();
	}, [roomId, currentUserId]);

	return { messages, isLoading, refetch: fetchMessages };
};

// 채팅방 목록 조회를 위한 훅
export const useChatRooms = () => {
	const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const currentUserId = useProfileStore((state) => state.currentUserId);

	const fetchChatRooms = useCallback(async () => {
		if (!currentUserId) {
			console.log("useChatRooms: currentUserId가 없습니다");
			return;
		}

		console.log("useChatRooms: 채팅방 목록 조회 시작", { currentUserId });
		setIsLoading(true);
		try {
			const fetchedChatRooms = await getChatRooms(currentUserId);
			console.log("useChatRooms: 조회된 채팅방", fetchedChatRooms);
			setChatRooms(fetchedChatRooms);
		} catch (error) {
			console.error("useChatRooms: 에러", error);
		} finally {
			setIsLoading(false);
		}
	}, [currentUserId]);

	useEffect(() => {
		fetchChatRooms();
	}, [fetchChatRooms]);

	// 실시간 채팅방 목록 구독
	useEffect(() => {
		if (!currentUserId) return;

		const channel = subscribeToChatRooms(currentUserId, () => {
			// 채팅방 목록 업데이트
			fetchChatRooms();
		});

		return () => {
			supabase.removeChannel(channel);
		};
	}, [currentUserId, fetchChatRooms]);

	return { chatRooms, isLoading, refetch: fetchChatRooms };
};

// 채팅방 생성 훅
export const useCreateChatRoom = () => {
	const [isLoading, setIsLoading] = useState(false);
	const currentUserId = useProfileStore((state) => state.currentUserId);

	const createRoom = useCallback(
		async (targetUserId: string) => {
			if (!currentUserId) return null;

			setIsLoading(true);
			try {
				// 먼저 기존 채팅방이 있는지 확인
				const existingRoom = await findExistingChatRoom(
					currentUserId,
					targetUserId,
				);
				if (existingRoom) {
					// 기존 채팅방이 있으면 그 채팅방 반환
					return existingRoom;
				}

				// 기존 채팅방이 없으면 새로 생성
				const newRoom = await createChatRoom(
					currentUserId,
					targetUserId,
				);
				return newRoom;
			} finally {
				setIsLoading(false);
			}
		},
		[currentUserId],
	);

	return { createRoom, isLoading };
};
