import { create } from "zustand";
import supabase from "../utils/supabase";

type Group = {
	id: string;
	name: string | null;
	bio?: string | null;
	profile_image_url?: string | null;
	created_at?: string;
};

type GroupStore = {
	groups: Group[];
	currentGroup: Group | null;
	loading: boolean;
	error: string | null;

	// Actions
	fetchUserGroups: (userId: string) => Promise<void>;
	setCurrentGroup: (group: Group | null) => void;
	clearGroups: () => void;
};

export const useGroupStore = create<GroupStore>((set) => ({
	groups: [],
	currentGroup: null,
	loading: false,
	error: null,

	fetchUserGroups: async (userId: string) => {
		try {
			set({ loading: true, error: null });

			// 사용자가 속한 그룹들 조회
			const { data: groupMemberships, error: membershipError } =
				await supabase
					.from("group_members")
					.select(
						`
          group_id,
          groups (
            id,
            name,
            bio,
            profile_image_url,
            created_at
          )
        `,
					)
					.eq("user_id", userId);

			if (membershipError) throw membershipError;

			const groups: Group[] = (groupMemberships || [])
				.map((membership: any) => ({
					id: membership.groups.id,
					name: membership.groups.name,
					bio: membership.groups.bio,
					profile_image_url: membership.groups.profile_image_url,
					created_at: membership.groups.created_at,
				}))
				.filter((group: Group) => group.id); // 유효한 그룹만 필터링

			set({
				groups,
				currentGroup: groups.length > 0 ? groups[0] : null,
				loading: false,
			});
		} catch (error) {
			console.error("[fetchUserGroups error]", error);
			set({
				error:
					error instanceof Error
						? error.message
						: "그룹을 불러오는데 실패했습니다.",
				loading: false,
			});
		}
	},

	setCurrentGroup: (group: Group | null) => {
		set({ currentGroup: group });
	},

	clearGroups: () => {
		set({ groups: [], currentGroup: null, error: null });
	},
}));
