import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

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
		const fetchUsers = async () => {
			const { data, error } = await supabase.from("users").select("*");

			if (error) {
				console.error("유저 목록 불러오기 실패:", error);
			} else {
				const sorted = (data || []).sort((a, b) => {
					if (a.is_online === b.is_online) return 0;
					return a.is_online ? -1 : 1;
				});
				setUserList(sorted);
			}
		};

		fetchUsers();

		const channel = supabase
			.channel("public:users")
			.on(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "users" },
				(payload) => {
					const updatedUser = payload.new as User;
					setUserList((prev) => {
						const updatedList = prev.map((u) =>
							u.auth_id === updatedUser.auth_id
								? { ...u, is_online: updatedUser.is_online }
								: u,
						);
						return updatedList.sort((a, b) => {
							if (a.is_online !== b.is_online)
								return a.is_online ? -1 : 1;
							return a.nickname.localeCompare(b.nickname, "ko");
						});
					});
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	return { userList };
}
