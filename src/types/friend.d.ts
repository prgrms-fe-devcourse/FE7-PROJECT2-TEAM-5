import type { Database } from "./database";

type Friend = Database["public"]["Tables"]["follows"]["Row"] & {
	users?: {
		auth_id: string;
		nickname: string;
		profile_image_url: string | null;
		is_online: boolean;
	} | null;
};
