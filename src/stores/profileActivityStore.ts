import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";
import type { Post } from "../types/post";
import type { Comment } from "../types/comment";

type PostState = {
	userPosts: Post[]; // 전체 게시글 List
	userComments: Comment[]; // 전체 댓글 List
	// fetchPosts: 전체 게시글 불러오기
	fetchUserPosts: (userId: string) => Promise<void>;
	// fetchComments: 전체 댓글 불러오기
	fetchUserComments: (userId: string) => Promise<void>;
};

export const usePostStore = create<PostState>()(
	immer((set) => ({
		userPosts: [],
		userComments: [],

		// 전체 게시글
		fetchUserPosts: async (userId: string) => {
			const { data, error } = await supabase
				.from("posts")
				.select("*")
				.eq("user_id", userId);

			if (error) {
				console.error("Failed to fetch posts:", error.message);
				return;
			}

			set((state) => {
				state.userPosts = data || [];
			});
		},

		// 전체 댓글
		fetchUserComments: async (userId: string) => {
			const { data, error } = await supabase
				.from("comments")
				.select("*")
				.eq("user_id", userId);

			if (error) {
				console.error("Failed to fetch comments:", error.message);
				return;
			}

			set((state) => {
				state.userComments = data || [];
			});
		},
	})),
);
