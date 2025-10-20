import type { Database } from "./database";

type UserProfile = Database["public"]["Tables"]["users"]["Row"];

type ChildInfo = {
	auth_id: string;
	nickname: string;
	child_link_code: string;
};
