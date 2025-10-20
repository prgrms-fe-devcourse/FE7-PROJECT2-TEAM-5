// src/hooks/useOnlineUsers.ts
import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

// 사용자 Row 타입 정의
export interface User {
	auth_id: string;
	nickname: string;
	profile_image_url?: string;
	role: string;
	birth_date?: string;
	major?: string;
	is_online: boolean;
}

export function useOnlineUsers() {
	const [userList, setUserList] = useState<User[]>([]);

	useEffect(() => {
		// async 함수는 useEffect 안에서 선언 후 호출
		const fetchUsers = async () => {
			// Supabase from() 첫 번째 인수는 문자열
			// Row 타입은 select<User>()로 지정
			const { data, error } = await supabase
				.from("users") // 테이블 이름 문자열
				.select("*"); // Row 타입 지정

			if (error) {
				console.error("유저 목록 불러오기 실패:", error);
			} else {
				setUserList(data || []);
			}
		};

		fetchUsers();

		// 실시간 구독
		const channel = supabase
			.channel("public:users")
			.on(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "users" },
				(payload) => {
					const updatedUser = payload.new as User;
					setUserList((prev) =>
						prev.map((u) =>
							u.auth_id === updatedUser.auth_id
								? { ...u, is_online: updatedUser.is_online }
								: u,
						),
					);
				},
			)
			.subscribe();

		// cleanup: 채널 해제
		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	return { userList };
}
