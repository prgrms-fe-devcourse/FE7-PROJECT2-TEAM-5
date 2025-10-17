import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";

type ProfileState = {
	profile: UserProfile | null;
	userId: string | null; // Supabase Auth ID 저장
	childInfos: ChildInfo[]; // 기존 자녀 정보
	loading: boolean;
	isLoggedIn: boolean;
	error: string | null;
	// fetchProfile: 현재 로그인한 사용자 정보 가져오기
	fetchProfile: (targetAuthId?: string | null) => void;
	// updateProfile: 현재 로그인한 사용자 정보 수정
	updateProfile: (updated: Partial<UserProfile>) => void;
	// updateValidChildCodes: 유효성 검사 후 업데이트
	updateValidChildCodes: (codes: string[]) => Promise<string[]>;
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
		childInfos: [],
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
					if (!user)
						return set((state) => {
							state.profile = null;
							state.userId = null;
							state.isLoggedIn = false;
							state.childInfos = [];
							state.loading = false;
						});
					authId = user.id;
				}

				// 2. users + child_parent_links 조인으로 한 번에 가져오기
				// 1) 부모 정보
				const { data: profileData, error: profileError } =
					await supabase
						.from("users")
						.select("*")
						.eq("auth_id", authId)
						.single();
				if (profileError) throw profileError;

				// 2) 자녀 정보
				const { data: childLinks, error: childError } = await supabase
					.from("child_parent_links")
					.select("child_id (auth_id, nickname, child_link_code)")
					.eq("parent_id", authId);
				if (childError) throw childError;

				// 3. 상태 업데이트
				set((state) => {
					state.profile = profileData;
					state.userId = authId;
					state.isLoggedIn = true;
					// 자녀 정보 바로 Zustand에 세팅, 자녀가 없으면 빈 배열
					state.childInfos =
						childLinks?.map((link: any) => link.child_id) ?? [];
					state.loading = false;
				});
			} catch (err: any) {
				set((state) => {
					state.error = err.message;
					state.profile = null;
					state.userId = null;
					state.isLoggedIn = false;
					state.childInfos = [];
					state.loading = false;
				});
			}
		},

		// 프로필 수정
		updateProfile: async (
			updates: Partial<UserProfile>,
			childCodes?: string[],
		) => {
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
					.eq("auth_id", profile.auth_id);
				if (error) throw error;

				if (childCodes?.length) {
					// 기존 자녀 링크 조회
					const { data: existingLinks } = await supabase
						.from("child_parent_links")
						.select("child_id")
						.eq("parent_id", profile.auth_id);
					const existingIds =
						existingLinks?.map((l) => l.child_id) ?? [];

					// 중복 제외하고 새 링크만 DB에 삽입
					const { error: insertError } = await supabase
						.from("child_parent_links")
						.insert(
							childCodes
								.map((code) => ({
									parent_id: profile.auth_id,
									child_link_code: code,
								}))
								.filter(
									(c) =>
										!existingIds.includes(
											c.child_link_code,
										),
								),
						)
						.select();
					if (insertError) throw insertError;
				}

				// 최신 프로필 재로딩
				await get().fetchProfile();
				set((state) => {
					state.loading = false;
				});
			} catch (err: any) {
				set((state) => {
					state.error = err.message;
					state.loading = false;
				});
			}
		},

		// 프로필 수정 후 자녀 코드 저장
		updateValidChildCodes: async (codes: string[]) => {
			const profile = get().profile;
			if (!profile) return [];

			const trimmedCodes = codes.map((c) => c.trim()).filter(Boolean);
			if (!trimmedCodes.length) {
				set((state) => {
					state.childInfos = [];
				});
				return [];
			}

			try {
				// 유효한 자녀 조회
				const { data: childrenData, error } = await supabase
					.from("users")
					.select("auth_id, nickname, child_link_code")
					.in("child_link_code", trimmedCodes);
				if (error) throw error;

				const validChildren = childrenData ?? [];
				const validCodes = validChildren.map((c) => c.child_link_code);

				const invalidCodes = trimmedCodes.filter(
					(c) => !validCodes.includes(c),
				);
				if (invalidCodes.length)
					throw new Error(
						`유효하지 않은 자녀코드: ${invalidCodes.join(", ")}`,
					);

				// 기존 부모-자녀 관계 조회
				const { data: existingLinks } = await supabase
					.from("child_parent_links")
					.select("child_id")
					.eq("parent_id", profile.auth_id);
				const existingIds = existingLinks?.map((l) => l.child_id) ?? [];

				// 새 링크만 삽입
				const newLinks = validChildren
					.filter((c) => !existingIds.includes(c.auth_id))
					.map((c) => ({
						parent_id: profile.auth_id,
						child_id: c.auth_id,
					}));

				if (newLinks.length) {
					const { error: insertError } = await supabase
						.from("child_parent_links")
						.insert(newLinks)
						.select();
					if (insertError) throw insertError;
				}

				// 🔹 Zustand 상태 업데이트
				set((state) => {
					state.childInfos = [
						...validChildren.filter((c) =>
							existingIds.includes(c.auth_id),
						),
						...newLinks.map(
							(link) =>
								validChildren.find(
									(c) => c.auth_id === link.child_id,
								)!,
						),
					];
				});

				return validCodes;
			} catch (err: any) {
				console.error("자녀코드 업데이트 오류:", err.message);
				throw err;
			}
		},

		logout: async () => {
			set((state) => {
				state.loading = true;
				state.error = null;
			});
			try {
				await supabase.auth.signOut();
				get().clearProfile();
			} catch (err: any) {
				set((state) => {
					state.error = err.message;
				});
			} finally {
				set((state) => {
					state.loading = false;
				});
			}
		},

		deleteProfile: async () => {
			const profile = get().profile;
			if (!profile) return;

			try {
				const { error: funcError } = await supabase.functions.invoke(
					"deleteUser",
					{
						body: { userId: profile.auth_id },
					},
				);
				if (funcError) throw funcError;

				set((state) => {
					state.profile = null;
					state.userId = null;
					state.isLoggedIn = false;
					state.childInfos = [];
				});

				await supabase.auth.signOut();
			} catch (err: any) {
				console.error("회원 삭제 중 오류:", err.message ?? err);
				alert("회원 삭제에 실패했습니다.");
			}
		},

		clearProfile: () => {
			set((state) => {
				state.profile = null;
				state.userId = null;
				state.isLoggedIn = false;
				state.childInfos = [];
				state.error = null;
				state.loading = false;
			});
		},
	})),
);
