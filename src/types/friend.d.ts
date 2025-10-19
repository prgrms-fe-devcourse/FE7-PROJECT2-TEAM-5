import type { Database } from "./database";

type Post = Database["public"]["Tables"]["follows"]["Row"] & {
	users?: {
		nickname: string;
		profile_image_url: string | null;
	} | null;
};
