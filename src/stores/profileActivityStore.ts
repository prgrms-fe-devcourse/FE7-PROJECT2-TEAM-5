import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";
import type { Comment } from "../types/comment";
import type { Post } from "../types/post";

type PostState = {
	userPosts: Post[]; // 유저 게시글 List
	userComments: Comment[]; // 유저 댓글 List
	parentComments: string[];
	commentsPosts: Post[];
	// fetchUserPosts: 유저 게시글 불러오기
	fetchUserPosts: (userId: string) => Promise<void>;
	// fetchUserComments: 유저 댓글 불러오기
	fetchUserComments: (userId: string) => Promise<void>;
	// fetchParentComments: 유저 댓글의 대댓글
	fetchParentComments: (userId: string) => Promise<void>;
	// fetchBoardType: 댓글을 달았던 게시글의 Board_Type 불러오기
	fetchBoardType: (userId: string) => Promise<void>;
};

export const usePostStore = create<PostState>()(
	immer((set) => ({
		userPosts: [],
		userComments: [],
		parentComments: [],
		commentsPosts: [],

		// 전체 게시글
		fetchUserPosts: async (userId: string) => {
			const { data, error } = await supabase
				.from("posts")
				.select(
					"*, post_likes(id), comments:comments!comments_post_id_fkey(id)",
				)
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) {
				console.error("유저 게시글 불러오기 실패:", error.message);
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
				.select("*, comment_likes(id)")
				.eq("user_id", userId)
				.order("created_at", { ascending: false });

			if (error) {
				console.error("유저 댓글 불러오기 실패:", error.message);
				return;
			}

			set((state) => {
				state.userComments = data || [];
			});
		},

		// 대댓글의 개수 구하기
		fetchParentComments: async (parent_comment_id: string) => {
			const { data, error } = await supabase
				.from("comments")
				.select("*")
				.eq("parent_comment_id", parent_comment_id);

			if (error) {
				console.error("대댓글 불러오기 실패:", error.message);
				return;
			}

			set((state) => {
				state.parentComments = data || [];
			});
		},

		// 댓글을 달았던 게시글의 Board_Type
		fetchBoardType: async (postId: string) => {
			const { data, error } = await supabase
				.from("posts")
				.select("*")
				.eq("id", postId);

			if (error) {
				console.error("대댓글 불러오기 실패:", error.message);
				return;
			}

			set((state) => {
				state.commentsPosts = data || [];
			});
		},
	})),
);
