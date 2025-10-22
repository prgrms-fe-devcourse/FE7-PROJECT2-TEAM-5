import type { Database } from "./database";

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
	users?: {
		nickname: string;
	} | null;
	post_likes?: string[] | null;
	comments?: string[] | null;
};
