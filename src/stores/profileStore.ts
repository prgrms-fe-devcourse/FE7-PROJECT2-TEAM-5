import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";

type ProfileState = {
	profile: UserProfile | null;
	currentUserId: string | null; // Supabase Auth ID 저장
	childInfos: ChildInfo[]; // 기존 자녀 정보
	loading: boolean;
	isLoggedIn: boolean;
	error: string | null;
	// fetchProfile: 로그인 유저 ID만 갱신
	fetchCurrentUserId: () => Promise<void>;
	// fetchProfile: 현재 로그인한 사용자 정보 가져오기
	fetchProfile: (targetAuthId?: string | null) => Promise<void>;
	// updateProfile: 현재 로그인한 사용자 정보 수정
	updateProfile: (
		updates: Partial<UserProfile>,
		childCodes?: string[],
	) => void;
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
		currentUserId: null,
		childInfos: [],
		isLoggedIn: false,
		loading: false,
		error: null,

		// 로그인 유저 ID만 가져오기
		fetchCurrentUserId: async () => {
			try {
				const {
					data: { user },
					error,
				} = await supabase.auth.getUser();
				if (error) throw error;

				set((state) => {
					state.currentUserId = user?.id ?? null;
					state.isLoggedIn = !!user;
				});
			} catch {
				set((state) => {
					state.currentUserId = null;
					state.isLoggedIn = false;
				});
			}
		},

		// 프로필 데이터 가져오기
		// 프로필 데이터 가져오기 (안전 수정 버전)
		fetchProfile: async (targetAuthId?: string | null) => {
			set((state) => {
				state.loading = true;
				state.error = null;
			});

			try {
				// 현재 로그인된 사용자 확인
				const {
					data: { user: currentUser },
					error: userError,
				} = await supabase.auth.getUser();
				if (userError) throw userError;

				if (!currentUser) throw new Error("로그인 정보가 없습니다.");

				// 로그인 상태만 갱신 (currentUserId는 덮어쓰지 않음)
				set((state) => {
					state.isLoggedIn = true;
				});

				// 불러올 프로필 대상 결정
				let authId: string | null = null;
				if (!targetAuthId || targetAuthId === "me") {
					authId = currentUser.id; // 내 프로필
				} else {
					authId = targetAuthId; // 다른 사람 프로필
				}

				// users 테이블에서 대상 프로필 가져오기
				const { data: profileData, error: profileError } =
					await supabase
						.from("users")
						.select("*")
						.eq("auth_id", authId)
						.single();

				if (profileError) throw profileError;

				// 부모인 경우 자녀 목록도 가져오기
				let childInfos: ChildInfo[] = [];
				if (profileData.role === "parent") {
					try {
						const { data: childLinks, error: childError } =
							await supabase
								.from("child_parent_links")
								.select(
									"child_id (auth_id, nickname, child_link_code)",
								)
								.eq("parent_id", authId);

						if (childError) throw childError;
						childInfos =
							childLinks?.map((link: any) => link.child_id) ?? [];
					} catch (childErr) {
						// 자녀 정보 불러오기 실패 시 로그만 남기고 진행
						console.error(
							"자녀 정보 로딩 실패:",
							(childErr as any).message,
						);
						childInfos = [];
					}
				}

				set((state) => {
					state.profile = profileData;
					state.childInfos = childInfos;
					state.loading = false;
					state.error = null;
					state.isLoggedIn = true; // 안전하게 로그인 상태 유지
				});
			} catch (err: any) {
				set((state) => {
					state.profile = null;
					state.childInfos = [];
					state.loading = false;
					state.error = err.message ?? "프로필 불러오기 실패";
					// ⚠️ isLoggedIn 상태는 유지
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

				// 1. 유저 정보 업데이트
				const { error } = await supabase
					.from("users")
					.update(updates)
					.eq("auth_id", profile.auth_id);
				if (error) throw error;

				// 2. 자녀 코드가 있으면 updateValidChildCodes 호출
				if (childCodes?.length) {
					await get().updateValidChildCodes(childCodes);
				}

				// 3. 최신 프로필 재로딩
				await get().fetchProfile(profile.auth_id);
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

		// 자녀 코드 업데이트 및 삭제 후 프로필 저장
		updateValidChildCodes: async (codes: string[]) => {
			const profile = get().profile;
			if (!profile) return [];

			const trimmedCodes = codes.map((c) => c.trim()).filter(Boolean);

			try {
				// 기존 부모-자녀 링크 조회
				const { data: existingLinks, error: linkError } = await supabase
					.from("child_parent_links")
					.select("child_id")
					.eq("parent_id", profile.auth_id);
				if (linkError) throw linkError;

				const existingIds = existingLinks?.map((l) => l.child_id) ?? [];

				// 새 배열에 포함된 유효한 자녀 조회
				const { data: validChildren, error: validError } =
					await supabase
						.from("users")
						.select("auth_id, nickname, child_link_code")
						.in("child_link_code", trimmedCodes);
				if (validError) throw validError;

				const validIds = validChildren?.map((c) => c.auth_id) ?? [];

				// 삭제할 자녀 ID 계산 (기존에 있었지만 새 배열에는 없는 코드)
				// 즉, 기존 링크 중 validIds에 없는 child_id
				const idsToDelete = existingIds.filter(
					(id) => !validIds.includes(id),
				);

				if (idsToDelete.length) {
					const { error: deleteError } = await supabase
						.from("child_parent_links")
						.delete()
						.in("child_id", idsToDelete)
						.eq("parent_id", profile.auth_id);
					if (deleteError) throw deleteError;
				}

				// 새 링크 삽입 (기존에 없는 것만)
				const idsToInsert = validIds
					.filter((id) => !existingIds.includes(id))
					.map((id) => ({
						parent_id: profile.auth_id,
						child_id: id,
					}));

				if (idsToInsert.length) {
					const { error: insertError } = await supabase
						.from("child_parent_links")
						.insert(idsToInsert);
					if (insertError) throw insertError;
				}

				// Zustand 상태 업데이트
				set((state) => {
					state.childInfos = validChildren;
				});

				return validChildren.map((c) => c.child_link_code);
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
					state.currentUserId = null;
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
				state.currentUserId = null;
				state.isLoggedIn = false;
				state.childInfos = [];
				state.error = null;
				state.loading = false;
			});
		},
	})),
);
