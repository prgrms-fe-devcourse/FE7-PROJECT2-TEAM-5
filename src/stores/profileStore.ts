// src/store/profileStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";

type UserProfile = {
	auth_id: string;
	bio?: string;
	birth_date: Date;
	child_link_code: string;
	created_at: Date;
	current_point: number;
	experience?: string;
	interests?: string[];
	is_profile_completed: boolean;
	major?: string;
	nickname: string;
	profile_image_url?: string;
	region?: string;
	representative_badge_id?: string;
	role: string;
};

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
};

// 테스트용
const MOCK_PROFILE: UserProfile = {
	auth_id: "1234",
	nickname: "암바사",
	role: "teacher",
	child_link_code: "ABC123",
	created_at: new Date(),
	birth_date: new Date("2010-01-01"),
	current_point: 0,
	is_profile_completed: false,
	major: "전공",
};

export const useProfileStore = create<ProfileState>()(
	immer((set) => ({
		profile: MOCK_PROFILE,
		userId: MOCK_PROFILE.auth_id,
		isLoggedIn: true,
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
					.eq("id", user.id)
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
	})),
);
