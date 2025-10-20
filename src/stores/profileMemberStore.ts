import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";
import type { Friend } from "../types/friend";

type MemberState = {
	friends: Friend[]; // UI에 바로 반영될 친구 목록
	userFollowed: Friend[]; // 유저가 팔로우한 친구 List
	userFollowing: Friend[]; // 유저를 팔로우한 친구 List
	followStatus: Record<string, boolean>; // 팔로잉 여부 관리 (UI용)
	onlineStatus: Record<string, boolean>; // 접속 여부 상태

	// fetchUserPosts: 해당 User와 팔로잉 중인 users 불러오기
	fetchUserFollowings: (userId: string) => Promise<void>;
	// followedUser: 팔로우 기능
	followedUser: (userId: string, following_id: string) => void;
	// unFollowUser
	unFollowUser: (userId: string, unFollowed_id: string) => void;

	// friends 상태 조작용
	setFriends: (friends: Friend[]) => void;
	removeFriend: (friendId: string) => void;

	// 개별 유저 상태 설정
	setOnlineStatus: (userId: string, status: boolean) => void;
	// 여러 유저 상태 한번에 업데이트
	updateOnlineStatus: (statuses: Record<string, boolean>) => void;
};

export const useMemberStore = create<MemberState>()(
	immer((set) => ({
		friends: [],
		userFollowed: [],
		userFollowing: [],
		followStatus: {},
		onlineStatus: {},

		// 해당 User와 팔로잉 중인 users 불러오기
		fetchUserFollowings: async (userId: string) => {
			const { data, error } = await supabase
				.from("follows")
				.select(
					"*, users!fk_Follows_following_id_users_id(auth_id, nickname, profile_image_url, is_online)",
				)
				.eq("follower_id", userId);

			if (error) {
				console.error("follows 테이블 불러오기 실패:", error.message);
				return;
			}

			const statusMap: Record<string, boolean> = {};
			data?.forEach((item) => {
				if (item.following_id) statusMap[item.following_id] = true;
			});

			const sortedData = (data || []).sort((a, b) => {
				const aOnline = a.users?.is_online ? 1 : 0;
				const bOnline = b.users?.is_online ? 1 : 0;
				return bOnline - aOnline;
			});

			set((state) => {
				state.userFollowed = sortedData;
				state.friends = sortedData;
				state.followStatus = statusMap;
			});
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
		followedUser: async (userId: string, following_id: string) => {
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
		unFollowUser: async (userId: string, unFollowing_id: string) => {
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
		setFriends: (friends) =>
			set((state) => {
				state.friends = friends;
			}),
		removeFriend: (friendId) =>
			set((state) => {
				state.friends = state.friends.filter(
					(f) => f.users?.auth_id !== friendId,
				);
			}),

		// 개별 유저 온라인 상태 변경
		setOnlineStatus: (userId, status) =>
			set((state) => {
				state.onlineStatus[userId] = status;
			}),

		// 여러 명 상태 한 번에 업데이트
		updateOnlineStatus: (statuses) =>
			set((state) => {
				state.onlineStatus = { ...state.onlineStatus, ...statuses };
			}),
	})),
);
