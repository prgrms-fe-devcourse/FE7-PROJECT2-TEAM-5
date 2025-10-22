import type { Database } from "../types/database";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";
import type { Comment } from "../types/Comment";

type DetailPost = Database["public"]["Tables"]["posts"]["Row"] & {
	user?: {
		nickname: string;
	} | null;
	files?:
		| {
				file_path: string;
				file_name: string;
		  }[]
		| undefined;

	post_likes?: { user_id: string }[];
};

type PostStore = {
	post: DetailPost | null;
	isLoading: boolean;
	isLiked: boolean;
	comments: Comment[] | null;
	fetchPost: (postId: string, currentUserId: string) => Promise<void>;
	deletePost: (postId: string) => Promise<void>;
	updateLike: (postId: string, currentUserId: string) => Promise<void>;
};

// type PostCreateData = {
// 	boardType: string | null;
// 	title: string | null;
// 	content: string | null;
// 	hashTag: string[] | null;
// 	imgFiles: { file: string; fileName: string }[];
// };
export const usePostStore = create<PostStore>()(
	immer((set) => ({
		post: null,
		isLoading: true,
		isLiked: false,
		comments: null,
		fetchPost: async (
			postId: string | undefined,
			currentUserId: string,
		) => {
			try {
				//게시물 정보 (작성자 닉네임, 첨부 파일도)
				const { data: post, error: postError } = await supabase
					.from("posts")
					.select(
						"*, user:users(nickname, representative_badge_id(badges(name,icon_url))), files(file_path, file_name), post_likes(user_id)",
					)
					.eq("id", postId)
					.single();
				if (postError) throw postError;

				//댓글과 댓글 작성자 정보 및 댓글 좋아요 (뱃지 현재 착용 뱃지 컬럼이 없는 것 같아서 아직 안가져옴)
				const { data: comments, error: commentsError } = await supabase
					.from("comments")
					.select(
						"*, user:users(auth_id,nickname, birth_date, representative_badge_id(badges(name,icon_url))), comment_likes(user_id)",
					)
					.eq("post_id", postId);
				if (commentsError) throw commentsError;

				// 원댓글 닉네임 매핑
				const parentMap: Record<string, string> = {};
				comments.forEach((c) => {
					if (!c.parent_comment_id) {
						parentMap[c.id] = c.user.nickname ?? "";
					}
				});
				const commentsWithParent = comments.map((c) => ({
					...c,
					parentNickname: c.parent_comment_id
						? parentMap[c.parent_comment_id]
						: null,
				}));

				//좋아요 눌렀는지 확인
				if (
					post.post_likes.some((like: { user_id: string }) => {
						return like.user_id === currentUserId;
					})
				) {
					set((state) => {
						state.isLiked = true;
					});
				} else {
					set((state) => {
						state.isLiked = false;
					});
				}

				set((state) => {
					state.post = { ...post };
					state.comments = commentsWithParent;
				});
			} catch (e) {
				console.error(e);
			} finally {
				set((state) => {
					state.isLoading = false;
				});
			}
		},
		deletePost: async (postId: string) => {
			try {
				const { error } = await supabase
					.from("posts")
					.delete()
					.eq("id", postId);
				if (error) throw error;
			} catch (e) {
				console.error(e);
			}
		},
		updateLike: async (postId: string, currentUserId: string) => {
			try {
				const { error } = await supabase
					.from("post_likes")
					.insert([{ user_id: currentUserId, post_id: postId }])
					.select();
				if (error) throw error;
				set((state) => {
					state.isLiked = true;
				});
			} catch (error) {
				console.error(error);
			}
		},
	})),
);
