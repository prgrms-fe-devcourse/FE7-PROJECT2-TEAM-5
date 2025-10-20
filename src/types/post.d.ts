import type { Database } from "./database";

type Post = Database["public"]["Tables"]["posts"]["Row"] & {
	users?: {
		nickname: string;
	} | null;
	likes?: string[] | null;
	comments?: string[] | null;
};
