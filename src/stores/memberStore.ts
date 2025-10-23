import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";
import type { Friend } from "../types/friend";

type MemberState = {
	friendsByProfileId: Record<string, Friend[]>; // 현재 보고 있는 프로필 기준 친구 목록 (UI 반영)
	userFollowed: Friend[]; // 로그인한 내 팔로우 리스트 (UserList용)
	followStatus: Record<string, boolean>; // 로그인한 내가 팔로우 중인지
	userFollowing: Friend[]; // 유저를 팔로우한 친구 List
	onlineStatus: Record<string, boolean>; // 접속 여부 상태

	// 해당 User와 팔로잉 중인 users 불러오기 or 그룹 멤버 불러오기
	fetchUserFollowings: (userId: string, gid?: string) => Promise<Friend[]>;

	// 팔로우/언팔로우 기능
	followedUserFnc: (userId: string, following_id: string) => void;
	unFollowUserFnc: (userId: string, unFollowed_id: string) => void;

	// friends 상태 조작용
	setFriends: (profileId: string, friends: Friend[]) => void;
	removeFriend: (profileId: string, friendId: string) => void;

	// UserList UI용 상태 업데이트
	setFollowStatus: (userId: string, status: boolean) => void;
	setUserFollowed: (
		friends: Friend[] | ((prev: Friend[]) => Friend[]),
	) => void;

	// 온라인 상태
	setOnlineStatus: (userId: string, status: boolean) => void;
	updateOnlineStatus: (statuses: Record<string, boolean>) => void;
};

export const useMemberStore = create<MemberState>()(
	immer((set) => ({
		friendsByProfileId: {},
		userFollowed: [],
		userFollowing: [],
		followStatus: {},
		onlineStatus: {},

		// 해당 User와 팔로잉 중인 users 불러오기
		fetchUserFollowings: async (
			userId: string,
			gid?: string,
		): Promise<Friend[]> => {
			let result: Friend[] = [];

			// 그룹 멤버 가져오기
			if (gid) {
				try {
					const { data: memberIds, error: memberError } =
						await supabase
							.from("group_members")
							.select("user_id")
							.eq("group_id", gid);

					if (memberError) throw memberError;

					const ids = memberIds.map((m) => m.user_id) ?? [];
					if (ids.length === 0) {
						set((state) => {
							state.friendsByProfileId[gid] = [];
						});
						return [];
					}

					const { data: users, error: userError } = await supabase
						.from("users")
						.select(
							"auth_id, nickname, profile_image_url, is_online, last_seen",
						)
						.in("auth_id", ids);

					if (userError) throw userError;

					const members: Friend[] = users.map((user) => ({
						id: crypto.randomUUID(), // 임의 id
						created_at: new Date().toISOString(), // 임의 created_at
						follower_id: "", // 그룹 멤버라서 팔로우 정보 없음
						following_id: user.auth_id,
						users: {
							auth_id: user.auth_id,
							nickname: user.nickname,
							profile_image_url: user.profile_image_url,
							is_online: user.is_online,
							last_seen: user.last_seen,
						},
					}));

					result = members;

					set((state) => {
						state.friendsByProfileId[gid] = members;
					});

					return members;
				} catch (err: any) {
					console.error("그룹 멤버 불러오기 실패:", err.message);
					return [];
				}
			}

			try {
				const { data, error } = await supabase
					.from("follows")
					.select(
						`
							*,
							users!follows_following_id_fkey(
							auth_id,
							nickname,
							profile_image_url,
							is_online,
							last_seen
							)
						`,
					)
					.eq("follower_id", userId);

				if (error) throw error;

				const statusMap: Record<string, boolean> = {};
				(data || []).forEach((item) => {
					if (item.following_id) statusMap[item.following_id] = true;
				});

				const sortedData = (data || []).sort((a, b) => {
					const aOnline = a.users?.is_online ? 1 : 0;
					const bOnline = b.users?.is_online ? 1 : 0;
					return bOnline - aOnline;
				});

				set((state) => {
					state.userFollowed = sortedData;
					state.friendsByProfileId[userId] = sortedData;
				});

				result = [...result, ...sortedData];
			} catch (err: any) {
				console.error("목록 불러오기 실패:", err.message);
			}

			return result;
		},

		// 해당 User를 팔로우한 users 불러오기
		fetchUserFollowers: async (userId: string) => {
			const { data, error } = await supabase
				.from("follows")
				.select(
					"*, users!fk_Follows_following_id_users_id(auth_id, nickname, profile_image_url, is_online)",
				)
				.eq("following_id", userId);

			if (error) {
				console.error("follows 테이블 불러오기 실패:", error.message);
				return;
			}

			set((state) => {
				state.userFollowing = data || [];
			});
		},

		// 팔로우 기능
		followedUserFnc: async (userId: string, following_id: string) => {
			try {
				// 1. 이미 팔로우했는지 체크
				const { data: existing, error: checkError } = await supabase
					.from("follows")
					.select("*")
					.eq("follower_id", userId)
					.eq("following_id", following_id)
					.maybeSingle(); // 한 개만 존재할 수 있음

				if (checkError) throw checkError;
				if (existing) {
					console.log("이미 팔로우 중입니다.");
					return;
				}

				// 2. 팔로우 추가
				const { error } = await supabase
					.from("follows")
					.insert([{ follower_id: userId, following_id }])
					.select();

				if (error) throw error;

				// 3. 상태 업데이트
				set((state) => {
					state.followStatus[following_id] = true;
				});
			} catch (err: any) {
				console.error("팔로우 실패:", err.message);
			}
		},

		// 언팔로우 기능
		unFollowUserFnc: async (userId: string, unFollowing_id: string) => {
			const { error } = await supabase
				.from("follows")
				.delete()
				.eq("follower_id", userId) // 로그인한 사용자
				.eq("following_id", unFollowing_id) // 언팔 대상
				.select();

			if (error) {
				console.error("언팔로우 실패:", error.message);
				return;
			}

			set((state) => {
				state.followStatus[unFollowing_id] = false;
			});
		},

		// friends 상태 조작용
		setFriends: (profileId, friends) =>
			set((state) => {
				state.friendsByProfileId[profileId] = friends;
			}),
		removeFriend: (profileId, friendId) =>
			set((state) => {
				state.friendsByProfileId[profileId] =
					state.friendsByProfileId[profileId]?.filter(
						(f) => f.users?.auth_id !== friendId,
					) || [];
			}),

		// UserList UI용 상태
		setFollowStatus: (userId, status) =>
			set((state) => {
				state.followStatus[userId] = status;
			}),
		setUserFollowed: (friends) =>
			set((state) => {
				if (typeof friends === "function") {
					state.userFollowed = friends(
						state.userFollowed as Friend[],
					);
				} else {
					state.userFollowed = friends;
				}
			}),

		// 온라인 상태
		setOnlineStatus: (userId, status) =>
			set((state) => {
				state.onlineStatus[userId] = status;
			}),
		updateOnlineStatus: (statuses) =>
			set((state) => {
				state.onlineStatus = { ...state.onlineStatus, ...statuses };
			}),
	})),
);
