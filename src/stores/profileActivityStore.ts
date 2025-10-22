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
	// fetchUserCommentsWithPosts: 유저의 댓글과 해당 댓글이 달린 게시글 정보 같이 불러오기
	fetchUserCommentsWithPosts: (userId?: string | null) => Promise<void>;
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

		// 댓글 + 해당 게시글 정보
		fetchUserCommentsWithPosts: async (userId?: string | null) => {
			try {
				// 댓글 불러오기
				const { data: commentsData, error: commentsError } =
					await supabase
						.from("comments")
						.select("*, comment_likes(id)")
						.eq("user_id", userId)
						.order("created_at", { ascending: false });

				if (commentsError) {
					console.error(
						"유저 댓글 불러오기 실패:",
						commentsError.message,
					);
					return;
				}

				if (!commentsData || commentsData.length === 0) {
					set((state) => {
						state.userComments = [];
					});
					return;
				}

				// 댓글이 달린 게시글 id 모으기
				const postIds = Array.from(
					new Set(commentsData.map((c) => c.post_id)),
				);

				// 게시글 정보 가져오기
				const { data: postsData, error: postsError } = await supabase
					.from("posts")
					.select("id, title, board_type")
					.in("id", postIds);

				if (postsError) {
					console.error(
						"댓글 게시글 불러오기 실패:",
						postsError.message,
					);
					return;
				}

				// 댓글 + 게시글 병합
				const mergedComments = commentsData.map((comment) => {
					const matchedPost = postsData?.find(
						(p) => p.id === comment.post_id,
					);
					return { ...comment, post: matchedPost || null };
				});

				set((state) => {
					state.userComments = mergedComments;
				});
			} catch (err) {
				console.error("fetchUserCommentsWithPosts 실행 중 오류:", err);
			}
		},
	})),
);
