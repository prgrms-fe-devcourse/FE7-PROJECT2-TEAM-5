// src/store/profileStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";

type ProfileState = {
	profile: UserProfile | null;
	userId: string | null; // Supabase Auth ID 저장
	loading: boolean;
	isLoggedIn: boolean;
	error: string | null;
	// fetchProfile: 현재 로그인한 사용자 정보 가져오기
	fetchProfile: () => Promise<void>;
	// clearProfile: 로그아웃 시 상태 초기화
	clearProfile: () => void;
	// updateProfile: 현재 로그인한 사용자 정보 수정
	updateProfile: (updated: Partial<UserProfile>) => void;
};

// 테스트용
/* const MOCK_PROFILE: UserProfile = {
	auth_id: "1234",
	nickname: "암바사",
	role: "teacher",
	child_link_code: "ABC123",
	created_at: new Date(),
	birth_date: new Date("2010-01-01"),
	current_point: 0,
	is_profile_completed: false,
	major: "전공",
}; */

export const useProfileStore = create<ProfileState>()(
	immer((set, get) => ({
		profile: null,
		userId: null,
		isLoggedIn: false,
		loading: false,
		error: null,

		fetchProfile: async () => {
			set((state) => {
				state.loading = true;
				state.error = null;
			});

			try {
				// 1. 현재 로그인된 사용자 가져오기
				const {
					data: { user },
					error: userError,
				} = await supabase.auth.getUser();

				if (userError) throw userError;
				if (!user) {
					// 로그인 안 된 상태
					set((state) => {
						state.profile = null;
						state.userId = null;
						state.isLoggedIn = false;
						state.loading = false;
					});
					return;
				}

				// 2. users 테이블에서 해당 사용자 row 가져오기
				const { data, error } = await supabase
					.from("users")
					.select("*")
					.eq("auth_id", user.id)
					.single();

				if (error) throw error;

				// 3️. 상태 업데이트
				set((state) => {
					state.userId = user.id;
					state.profile = data;
					state.isLoggedIn = true;
					state.loading = false;
				});
			} catch (err: any) {
				set((state) => {
					state.error = err.message;
					state.profile = null;
					state.userId = null;
					state.isLoggedIn = false;
					state.loading = false;
				});
			}
		},

		clearProfile: () => {
			set((state) => {
				state.profile = null;
				state.userId = null;
				state.isLoggedIn = false;
				state.error = null;
				state.loading = false;
			});
		},

		updateProfile: async (updates: Partial<UserProfile>) => {
			set((state) => {
				state.loading = true;
				state.error = null;
			});

			try {
				const { profile } = get();
				if (!profile) throw new Error("프로필이 없습니다.");

				const { error } = await supabase
					.from("users")
					.update(updates)
					.eq("auth_id", profile.auth_id); // auth_id 기준으로 수정

				if (error) throw error;

				// 최신 데이터 다시 불러오기
				await get().fetchProfile();
				set((state) => {
					state.loading = false;
				});
			} catch (err: any) {
				set((state) => {
					state.loading = false;
					state.error = err.message;
				});
			}
		},
	})),
);
