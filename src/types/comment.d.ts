import type { Database } from "./database";

type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
	user?: {
		auth_id: string;
<<<<<<< HEAD
		nickname?: string;
=======
		nickname: string;
>>>>>>> main
		birth_date: string;
		representative_badge_id: {
			badges: {
				name: string;
				icon_url: string;
			};
		};
		parent_comment_id?: string;
		profile_image_url?: string;
	};
	post?: {
		id: string;
		board_type: string;
		title: string;
	};
	comment_likes?: { user_id: string }[];
	parentNickname?: string | null;
	reply_count?: number;
};
