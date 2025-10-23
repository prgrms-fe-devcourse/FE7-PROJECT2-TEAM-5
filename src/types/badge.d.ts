export type BadgeLog = Database["public"]["Tables"]["badge_logs"]["Row"] & {
	badges?: {
		id?: string;
		name?: string;
		icon_url?: string;
		description?: string | null;
		created_at: string;
	};
};
