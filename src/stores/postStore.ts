import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Post } from "../types/post";
import supabase from "../utils/supabase";
import type { Comment } from "../types/comment";

type PostState = {
	allPosts: Post[]; // 전체 게시글 List
	allComments: Comment[]; // 전체 댓글 List
	// fetchPosts: 전체 게시글 불러오기
	fetchPosts: () => Promise<void>;
	// fetchComments: 전체 댓글 불러오기
	fetchComments: () => Promise<void>;
};

export const usePostStore = create<PostState>()(
	immer((set) => ({
		allPosts: [],
		allComments: [],
		userPosts: [],
		userComments: [],

		// 전체 게시글
		fetchPosts: async () => {
			const { data, error } = await supabase.from("posts").select("*");
			if (error) {
				console.error("Failed to fetch posts:", error.message);
				return;
			}
			set((state) => {
				state.allPosts = data || [];
			});
		},

		// 전체 댓글
		fetchComments: async () => {
			const { data, error } = await supabase.from("comments").select("*");
			if (error) {
				console.error("Failed to fetch comments:", error.message);
				return;
			}
			set((state) => {
				state.allComments = data || [];
			});
		},
	})),
);
