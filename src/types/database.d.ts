export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "13.0.5";
	};
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					extensions?: Json;
					operationName?: string;
					query?: string;
					variables?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			badge_logs: {
				Row: {
					badge_id: string;
					created_at: string;
					id: string;
					user_id: string;
				};
				Insert: {
					badge_id: string;
					created_at?: string;
					id?: string;
					user_id: string;
				};
				Update: {
					badge_id?: string;
					created_at?: string;
					id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "badge_logs_badge_id_fkey";
						columns: ["badge_id"];
						isOneToOne: false;
						referencedRelation: "badges";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "badge_logs_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
				];
			};
			badges: {
				Row: {
					created_at: string;
					description: string | null;
					icon_url: string | null;
					id: string;
					name: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					icon_url?: string | null;
					id?: string;
					name: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					icon_url?: string | null;
					id?: string;
					name?: string;
				};
				Relationships: [];
			};
			child_parent_links: {
				Row: {
					child_id: string;
					created_at: string;
					id: string;
					parent_id: string;
				};
				Insert: {
					child_id: string;
					created_at?: string;
					id?: string;
					parent_id: string;
				};
				Update: {
					child_id?: string;
					created_at?: string;
					id?: string;
					parent_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "child_parent_links_child_id_fkey";
						columns: ["child_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
					{
						foreignKeyName: "child_parent_links_parent_id_fkey";
						columns: ["parent_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
				];
			};
			comment_likes: {
				Row: {
					comment_id: string;
					created_at: string;
					id: string;
					user_id: string;
				};
				Insert: {
					comment_id: string;
					created_at: string;
					id?: string;
					user_id: string;
				};
				Update: {
					comment_id?: string;
					created_at?: string;
					id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "comment_likes_comment_id_fkey";
						columns: ["comment_id"];
						isOneToOne: false;
						referencedRelation: "comments";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "fk_commnet_likes_user_id_users_id";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
				];
			};
			comments: {
				Row: {
					content: string;
					created_at: string;
					id: string;
					parent_comment_id: string | null;
					post_id: string;
					user_id: string;
				};
				Insert: {
					content: string;
					created_at?: string;
					id?: string;
					parent_comment_id?: string | null;
					post_id: string;
					user_id: string;
				};
				Update: {
					content?: string;
					created_at?: string;
					id?: string;
					parent_comment_id?: string | null;
					post_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "comments_parent_comment_id_fkey";
						columns: ["parent_comment_id"];
						isOneToOne: false;
						referencedRelation: "comments";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "comments_post_id_fkey";
						columns: ["post_id"];
						isOneToOne: false;
						referencedRelation: "posts";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "comments_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
				];
			};
			files: {
				Row: {
					file_name: string;
					file_path: string;
					id: string;
					post_id: string;
				};
				Insert: {
					file_name: string;
					file_path: string;
					id?: string;
					post_id: string;
				};
				Update: {
					file_name?: string;
					file_path?: string;
					id?: string;
					post_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "files_post_id_fkey";
						columns: ["post_id"];
						isOneToOne: false;
						referencedRelation: "posts";
						referencedColumns: ["id"];
					},
				];
			};
			follows: {
				Row: {
					created_at: string;
					follower_id: string;
					following_id: string;
					id: string;
				};
				Insert: {
					created_at?: string;
					follower_id: string;
					following_id: string;
					id?: string;
				};
				Update: {
					created_at?: string;
					follower_id?: string;
					following_id?: string;
					id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "fk_Follows_follower_id_users_id";
						columns: ["follower_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
					{
						foreignKeyName: "fk_Follows_following_id_users_id";
						columns: ["following_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
				];
			};
			group_members: {
				Row: {
					created_at: string;
					group_id: string;
					id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					group_id: string;
					id?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					group_id?: string;
					id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "group_members_group_id_fkey";
						columns: ["group_id"];
						isOneToOne: false;
						referencedRelation: "groups";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "group_members_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
				];
			};
			groups: {
				Row: {
					bio: string | null;
					created_at: string;
					id: string;
					name: string;
					profile_image_url: string | null;
				};
				Insert: {
					bio?: string | null;
					created_at?: string;
					id?: string;
					name: string;
					profile_image_url?: string | null;
				};
				Update: {
					bio?: string | null;
					created_at?: string;
					id?: string;
					name?: string;
					profile_image_url?: string | null;
				};
				Relationships: [];
			};
			messages: {
				Row: {
					created_at: string;
					id: string;
					message: string;
					receiver_id: string;
					sender_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					message: string;
					receiver_id: string;
					sender_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					message?: string;
					receiver_id?: string;
					sender_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "fk_messages_receiver_id_users_id";
						columns: ["receiver_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
					{
						foreignKeyName: "fk_messages_sender_id_users_id";
						columns: ["sender_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
				];
			};
			notifications: {
				Row: {
					actor_id: string;
					content: string | null;
					created_at: string;
					id: string;
					message: string;
					target_id: string;
					type: string;
					user_id: string;
				};
				Insert: {
					actor_id: string;
					content?: string | null;
					created_at: string;
					id?: string;
					message: string;
					target_id: string;
					type: string;
					user_id: string;
				};
				Update: {
					actor_id?: string;
					content?: string | null;
					created_at?: string;
					id?: string;
					message?: string;
					target_id?: string;
					type?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "notifications_actor_id_fkey";
						columns: ["actor_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
					{
						foreignKeyName: "notifications_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
				];
			};
			point_logs: {
				Row: {
					created_at: string;
					description: string | null;
					id: string;
					point: number;
					user_id: string;
				};
				Insert: {
					created_at: string;
					description?: string | null;
					id?: string;
					point: number;
					user_id: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					id?: string;
					point?: number;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "fk_point_logs_user_id_users_id";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
				];
			};
			post_likes: {
				Row: {
					created_at: string;
					id: string;
					post_id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					post_id: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					post_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "fk_post__likes_user_id_users_id";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
					{
						foreignKeyName: "post_likes_post_id_fkey";
						columns: ["post_id"];
						isOneToOne: false;
						referencedRelation: "posts";
						referencedColumns: ["id"];
					},
				];
			};
			posts: {
				Row: {
					adopted_comment_id: string | null;
					board_type: string;
					content: string;
					created_at: string;
					group_board_type: string | null;
					group_id: string | null;
					hash_tag: string[] | null;
					id: string;
					title: string;
					user_id: string;
				};
				Insert: {
					adopted_comment_id?: string | null;
					board_type: string;
					content: string;
					created_at?: string;
					group_board_type?: string | null;
					group_id?: string | null;
					hash_tag?: string[] | null;
					id?: string;
					title: string;
					user_id: string;
				};
				Update: {
					adopted_comment_id?: string | null;
					board_type?: string;
					content?: string;
					created_at?: string;
					group_board_type?: string | null;
					group_id?: string | null;
					hash_tag?: string[] | null;
					id?: string;
					title?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "posts_adopted_comment_id_fkey";
						columns: ["adopted_comment_id"];
						isOneToOne: false;
						referencedRelation: "comments";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "posts_group_id_fkey";
						columns: ["group_id"];
						isOneToOne: false;
						referencedRelation: "groups";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "posts_user_id_fkey1";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["auth_id"];
					},
				];
			};
			users: {
				Row: {
					auth_id: string;
					bio: string | null;
					birth_date: string;
					child_link_code: string | null;
					created_at: string;
					current_point: number | null;
					experience: string | null;
					gender: string | null;
					habits: string[] | null;
					interests: string[] | null;
					is_online: boolean | null;
					is_profile_completed: boolean;
					last_seen: string | null;
					major: string | null;
					nickname: string;
					profile_image_url: string | null;
					region: string | null;
					representative_badge_id: string | null;
					role: string;
				};
				Insert: {
					auth_id: string;
					bio?: string | null;
					birth_date: string;
					child_link_code?: string | null;
					created_at?: string;
					current_point?: number | null;
					experience?: string | null;
					gender?: string | null;
					habits?: string[] | null;
					interests?: string[] | null;
					is_online?: boolean | null;
					is_profile_completed?: boolean;
					last_seen?: string | null;
					major?: string | null;
					nickname: string;
					profile_image_url?: string | null;
					region?: string | null;
					representative_badge_id?: string | null;
					role: string;
				};
				Update: {
					auth_id?: string;
					bio?: string | null;
					birth_date?: string;
					child_link_code?: string | null;
					created_at?: string;
					current_point?: number | null;
					experience?: string | null;
					gender?: string | null;
					habits?: string[] | null;
					interests?: string[] | null;
					is_online?: boolean | null;
					is_profile_completed?: boolean;
					last_seen?: string | null;
					major?: string | null;
					nickname?: string;
					profile_image_url?: string | null;
					region?: string | null;
					representative_badge_id?: string | null;
					role?: string;
				};
				Relationships: [
					{
						foreignKeyName: "users_representative_badge_id_fkey";
						columns: ["representative_badge_id"];
						isOneToOne: false;
						referencedRelation: "badge_logs";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			generate_child_link_code: {
				Args: { len: number };
				Returns: string;
			};
			generate_random_string: {
				Args: { len: number };
				Returns: string;
			};
		};
		Enums: {
			user_role: "temp" | "student" | "teacher" | "parent";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	graphql_public: {
		Enums: {},
	},
	public: {
		Enums: {
			user_role: ["temp", "student", "teacher", "parent"],
		},
	},
} as const;
