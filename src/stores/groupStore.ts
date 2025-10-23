import { create } from "zustand";
import supabase from "../utils/supabase";

type Group = {
	id: string;
	name: string | null;
	bio?: string | null;
	profile_image_url?: string | null;
	created_at?: string;
	member_count?: number; // 멤버 수 추가
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

			// 사용자가 속한 그룹들 조회 (멤버 수 포함)
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

			// 각 그룹별로 멤버 수 조회
			const groups: Group[] = [];
			for (const membership of groupMemberships || []) {
				const group = (membership as any).groups;
				if (!group?.id) continue;

				// 해당 그룹의 멤버 수 조회
				const { count: memberCount } = await supabase
					.from("group_members")
					.select("*", { count: "exact", head: true })
					.eq("group_id", group.id);

				groups.push({
					id: group.id,
					name: group.name,
					bio: group.bio,
					profile_image_url: group.profile_image_url,
					created_at: group.created_at,
					member_count: memberCount || 0,
				});
			}

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
