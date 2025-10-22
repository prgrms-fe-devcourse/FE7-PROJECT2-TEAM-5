import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";
import type { Comment } from "../types/comment";
import type { Post } from "../types/post";

type ActPostState = {
	userPosts: Post[]; // 유저 게시글 List
	userComments: Comment[]; // 유저 댓글 List
	// fetchUserPosts: 유저 게시글 불러오기
	fetchUserPosts: (userId?: string) => Promise<void>;
	// fetchUserCommentsWithPosts: 유저의 댓글과 해당 댓글이 달린 게시글 정보 같이 불러오기
	fetchUserCommentsWithPosts: (userId?: string) => Promise<void>;
};

export const useActPostStore = create<ActPostState>()(
	immer((set) => ({
		userPosts: [],
		userComments: [],

		// 전체 게시글
		fetchUserPosts: async (userId?: string) => {
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
		fetchUserCommentsWithPosts: async (userId?: string) => {
			try {
				// 1. 댓글 불러오기
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

				// 2. 댓글이 달린 게시글 id 모으기
				const postIds = Array.from(
					new Set(commentsData.map((c) => c.post_id)),
				);

				// 3. 게시글 정보 가져오기
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

				// 4. parent_comment_id가 있는 댓글의 user_id 모으기
				const parentCommentIds = commentsData
					.filter((c) => c.parent_comment_id)
					.map((c) => c.parent_comment_id)
					.filter(Boolean);

				let parentUserMap: Record<
					string,
					{ auth_id: string; nickname: string }
				> = {};

				if (parentCommentIds.length > 0) {
					// 5. parent 댓글 정보 가져오기
					const { data: parentComments, error: parentCommentsError } =
						await supabase
							.from("comments")
							.select("id, user_id")
							.in("id", parentCommentIds);

					if (parentCommentsError) {
						console.error(
							"부모 댓글 불러오기 실패:",
							parentCommentsError.message,
						);
					} else if (parentComments && parentComments.length > 0) {
						// 6. parent 댓글 작성자의 user 정보 가져오기
						const userIds = Array.from(
							new Set(parentComments.map((c) => c.user_id)),
						);
						if (userIds.length > 0) {
							const { data: usersData, error: usersError } =
								await supabase
									.from("users")
									.select("*")
									.in("auth_id", userIds);

							if (usersError) {
								console.error(
									"부모 유저 정보 불러오기 실패:",
									usersError.message,
								);
							} else if (usersData && usersData.length > 0) {
								parentComments.forEach((pc) => {
									const user = usersData.find(
										(u) => u.auth_id === pc.user_id,
									);
									if (user) parentUserMap[pc.id] = user;
								});
							}
						}
					}
				}

				// 7. 댓글 + 게시글 + parent user 병합
				const mergedComments = commentsData.map((comment) => {
					const matchedPost = postsData?.find(
						(p) => p.id === comment.post_id,
					);
					const parentUser =
						comment.parent_comment_id &&
						parentUserMap[comment.parent_comment_id]
							? parentUserMap[comment.parent_comment_id]
							: undefined;

					return {
						...comment,
						post: matchedPost || null,
						user: parentUser || null,
					};
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
