import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";

type UserListState = {
	userList: User[];
	// fetchUsers: 전체 유저 리스트 가져오기
	fetchUsers: () => Promise<void>;
};

export const userListStore = create<UserListState>()(
	immer((set) => ({
		userList: [],
		// 전체 유저 리스트 가져오기
		fetchUsers: async () => {
			try {
				const { data, error } = await supabase
					.from("users")
					.select("*");
				if (error) throw error;

				set({ userList: data || [] });
			} catch (err) {
				console.error("유저 목록 로딩 오류:", err);
			}
		},
	})),
);
