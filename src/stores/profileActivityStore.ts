import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";
import type { Comment } from "../types/comment";
import type { Post } from "../types/post";

type ActPostState = {
	userPosts: Post[]; // 유저 게시글 List
	userComments: Comment[]; // 유저 댓글 List
	// fetchUserPosts: 유저 게시글 불러오기
	fetchUserPosts: (userId?: string | null) => Promise<void>;
	// fetchUserComments: 유저 댓글 불러오기
	fetchUserComments: (userId?: string | null) => Promise<void>;
};

export const useActPostStore = create<ActPostState>()(
	immer((set) => ({
		userPosts: [],
		userComments: [],

		// 전체 게시글
		fetchUserPosts: async (userId?: string | null) => {
			const { data, error } = await supabase
				.from("posts")
				.select(
					"*, likes:post_likes(id), comments:comments!comments_post_id_fkey(id)",
				)
				.eq("user_id", userId);

			if (error) {
				console.error(
					"user의 posts 테이블 불러오기 실패:",
					error.message,
				);
				return;
			}

			set((state) => {
				state.userPosts = data || [];
			});
		},

		// 전체 댓글
		fetchUserComments: async (userId?: string | null) => {
			const { data, error } = await supabase
				.from("comments")
				.select("*")
				.eq("user_id", userId);

			if (error) {
				console.error(
					"user의 comments 테이블 불러오기 실패:",
					error.message,
				);
				return;
			}

			set((state) => {
				state.userComments = data || [];
			});
		},
	})),
);
