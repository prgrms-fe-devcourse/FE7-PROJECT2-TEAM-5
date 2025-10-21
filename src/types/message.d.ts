// 메시지 관련 타입 정의
export interface Message {
	id: string;
	sender_id: string;
	receiver_id: string;
	message: string;
	created_at: string;
}

// 메시지 전송을 위한 타입, id와 created_at는 자동으로 생성되므로 전달하지 않음
export interface MessageSend {
	sender_id: string;
	receiver_id: string;
	message: string;
}

// 채팅방 정보
export interface ChatRoom {
	id: string;
	user1_id: string;
	user2_id: string;
	is_read_user1: boolean;
	is_read_user2: boolean;
	last_message_id?: string;
	last_message_at?: string;
	created_at: string;
	// 조회 시 추가되는 정보
	user1?: {
		nickname: string;
		profile_image_url?: string;
	};
	user2?: {
		nickname: string;
		profile_image_url?: string;
	};
	last_message?: {
		message: string;
		created_at: string;
	};
}
