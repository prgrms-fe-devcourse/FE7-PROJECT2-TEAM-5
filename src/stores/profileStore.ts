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
	fetchProfile: (targetAuthId?: string | null) => void;
	// updateProfile: 현재 로그인한 사용자 정보 수정
	updateProfile: (updated: Partial<UserProfile>) => void;
	// 로그아웃
	logout: () => Promise<void>;
	// deleteProfile: 현재 로그인한 사용자 삭제
	deleteProfile: (targetAuthId?: string | null) => void;
	// clearProfile: 로그아웃 시 상태 초기화
	clearProfile: () => void;
};

export const useProfileStore = create<ProfileState>()(
	immer((set, get) => ({
		profile: null,
		userId: null,
		isLoggedIn: false,
		loading: false,
		error: null,

		// 프로필 저장
		fetchProfile: async (targetAuthId?: string | null) => {
			set((state) => {
				state.loading = true;
				state.error = null;
			});

			try {
				let authId = targetAuthId;

				// 1. targetAuthId 없으면 현재 로그인 유저 정보 가져오기
				if (!authId) {
					const {
						data: { user },
						error: userError,
					} = await supabase.auth.getUser();
					if (userError) throw userError;
					if (!user) {
						set((state) => {
							state.profile = null;
							state.userId = null;
							state.isLoggedIn = false;
							state.loading = false;
						});
						return;
					}
					authId = user.id;
				}

				// 2. users 테이블에서 해당 사용자 row 가져오기
				const { data, error } = await supabase
					.from("users")
					.select("*")
					.eq("auth_id", authId)
					.single();

				if (error) throw error;

				// 3. 상태 업데이트
				set((state) => {
					state.profile = data;
					if (!targetAuthId) {
						state.userId = authId;
						state.isLoggedIn = true;
					}
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

		// 프로필 수정 후 저장
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

		logout: async () => {
			set({ loading: true, error: null });
			try {
				await supabase.auth.signOut();
				get().clearProfile();
			} catch (err: any) {
				set({ error: err.message });
			} finally {
				set({ loading: false });
			}
		},

		deleteProfile: async () => {
			const profile = get().profile;
			if (!profile) return;

			try {
				// supabase Edge Function 호출 (Auth 계정 삭제)
				const { data, error: funcError } =
					await supabase.functions.invoke("deleteUser", {
						body: { userId: profile.auth_id },
					});

				if (funcError) {
					console.error("Auth 계정 삭제 실패:", funcError.message);
					alert("계정 삭제에 실패했습니다. 다시 시도해주세요.");
					return;
				}

				console.log("Auth 계정 삭제 성공:", data);

				// 상태 초기화
				set((state) => {
					state.profile = null;
					state.userId = null;
					state.isLoggedIn = false;
				});

				// 로그아웃
				await supabase.auth.signOut();

				console.log("회원 완전 삭제 완료!");
				alert("계정이 성공적으로 삭제되었습니다.");
			} catch (err: any) {
				console.error("회원 삭제 중 오류:", err.message ?? err);
				alert("회원 삭제에 실패했습니다. 다시 시도해주세요.");
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
