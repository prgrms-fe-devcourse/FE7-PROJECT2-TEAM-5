import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";
import type { Post } from "../types/post";

type MemberState = {
	userFollowed: Post[]; // 유저 친구 List
	// fetchUserPosts: 해당 User와 팔로잉 중인 users 불러오기
	fetchUserFollowings: (userId: string) => Promise<void>;
};

export const useMemberStore = create<MemberState>()(
	immer((set) => ({
		userFollowed: [],

		// 해당 User와 팔로잉 중인 users 불러오기
		fetchUserFollowings: async (userId: string) => {
			const { data, error } = await supabase
				.from("follows")
				.select("*, friend:users(auth_id, nickname, profile_image_url)")
				.eq("user_id", userId);

			if (error) {
				console.error("Failed to fetch posts:", error.message);
				return;
			}

			set((state) => {
				state.userFollowed = data || [];
			});
		},
	})),
);
