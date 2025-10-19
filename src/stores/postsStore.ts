import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";
import type { Post } from "../types/post";

type PostsStore = {
	posts: Post[];
	isLoading: boolean;
	fetchPosts: (tab: string) => Promise<void>;
};
export const usePostsStore = create<PostsStore>()(
	immer((set) => ({
		posts: [],
		isLoading: false,
		fetchPosts: async (activeTab: string) => {
			set((state) => {
				state.isLoading = true;
			});

			if (activeTab === "all") {
				try {
					const { data: posts, error } = await supabase
						.from("posts")
						.select(
							"*, users(nickname), likes:post_likes(id), comments:comments!comments_post_id_fkey(id)",
						)
						.order("created_at", { ascending: false });

					if (error) throw error;
					set((state) => {
						state.posts = posts;
					});
				} catch (e) {
					console.error(e);
				} finally {
					set((state) => {
						state.isLoading = false;
					});
				}
			} else {
				try {
					const { data: posts, error } = await supabase
						.from("posts")
						.select(
							"*, users(nickname), likes:post_likes(id), comments:comments!comments_post_id_fkey(id)",
						)
						.eq("board_type", activeTab)
						.order("created_at", { ascending: false });

					if (error) throw error;
					set((state) => {
						state.posts = posts;
					});
				} catch (e) {
					console.error(e);
				} finally {
					set((state) => {
						state.isLoading = false;
					});
				}
			}
		},
	})),
);
