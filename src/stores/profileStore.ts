import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import supabase from "../utils/supabase";

type ProfileState = {
	profile: UserProfile | null;
	userId: string | null; // Supabase Auth ID 저장
	childCodes: string[]; // 기존 자녀 코드 저장
	loading: boolean;
	isLoggedIn: boolean;
	error: string | null;
	// fetchProfile: 현재 로그인한 사용자 정보 가져오기
	fetchProfile: (targetAuthId?: string | null) => void;
	// fetchChildCodes: 현재 로그인한 사용자의 자녀 정보 가져오기
	fetchChildCodes: () => Promise<void>;
	// updateProfile: 현재 로그인한 사용자 정보 수정
	updateProfile: (updated: Partial<UserProfile>) => void;
	// 유효성 검사 후 업데이트
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
		childCodes: [],
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
							state.childCodes = [];
							state.loading = false;
						});
					authId = user.id;
				}

				// users 테이블 프로필 가져오기
				const { data: profileData, error: profileError } =
					await supabase
						.from("users")
						.select("*")
						.eq("auth_id", authId)
						.single();
				if (profileError) throw profileError;

				// child_parent_links 테이블에서 기존 자녀 코드 가져오기
				const { data: codesData, error: codesError } = await supabase
					.from("child_parent_links")
					.select("child_link_code")
					.eq("parent_auth_id", authId);

				// 오류가 있으면 콘솔에만 찍고, childCodes는 빈 배열로 처리
				if (codesError) {
					console.warn(
						"자녀 코드 불러오기 실패:",
						codesError.message,
					);
				}

				set((state) => {
					state.profile = profileData;
					state.userId = authId;
					state.isLoggedIn = true;
					state.childCodes =
						codesData?.map((row: any) => row.child_link_code) ?? [];
					state.loading = false;
				});
			} catch (err: any) {
				set((state) => {
					state.error = err.message;
					state.profile = null;
					state.userId = null;
					state.isLoggedIn = false;
					state.childCodes = [];
					state.loading = false;
				});
			}
		},

		// 자녀 코드 조회
		fetchChildCodes: async () => {
			const profile = get().profile;
			if (!profile || profile.role !== "parent") return;

			try {
				const { data, error } = await supabase
					.from("child_parent_links")
					.select("child_link_code")
					.eq("parent_auth_id", profile.auth_id);

				if (error) throw error;

				const codes =
					data?.map((row: any) => row.child_link_code) ?? [];

				set((state) => {
					state.childCodes = codes;
				});
			} catch (err: any) {
				console.error("자녀 코드 불러오기 실패:", err.message ?? err);
			}
		},

		// 프로필 수정 후 저장
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

				// users 테이블 업데이트
				const { error } = await supabase
					.from("users")
					.update(updates)
					.eq("auth_id", profile.auth_id);
				if (error) throw error;

				// childCodes가 있으면 child_parent_links 테이블 업데이트
				if (childCodes && childCodes.length) {
					const links = childCodes.map((code) => ({
						parent_auth_id: profile.auth_id,
						child_link_code: code,
					}));
					const { error: linkError } = await supabase
						.from("child_parent_links")
						.insert(links)
						.select();
					if (linkError) throw linkError;
				}

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

		// 자녀 코드
		updateValidChildCodes: async (codes: string[]) => {
			const profile = get().profile;
			if (!profile) return [];

			const trimmedCodes = codes
				.map((c) => c.trim())
				.filter((c) => c !== "");
			if (trimmedCodes.length === 0) {
				set((state) => {
					state.childCodes = [];
				});
				return [];
			}

			try {
				// 1. 입력한 자녀코드로 users 테이블에서 자녀 auth_id 조회
				const { data: childrenData, error } = await supabase
					.from("users")
					.select("auth_id, child_link_code")
					.in("child_link_code", trimmedCodes);

				if (error) throw error;

				const validChildren = childrenData ?? [];
				const validCodes = validChildren.map(
					(c: any) => c.child_link_code,
				);

				// 2. 유효하지 않은 코드 확인
				const invalidCodes = trimmedCodes.filter(
					(c) => !validCodes.includes(c),
				);
				if (invalidCodes.length > 0) {
					throw new Error(
						`유효하지 않은 자녀코드: ${invalidCodes.join(", ")}`,
					);
				}

				// 3. child_parent_links에 부모-자녀 관계 삽입
				const links = validChildren.map((c: any) => ({
					parent_id: profile.auth_id,
					child_id: c.auth_id,
				}));

				if (links.length > 0) {
					const { error: insertError } = await supabase
						.from("child_parent_links")
						.insert(links)
						.select();

					if (insertError) throw insertError;
				}

				// 4. Zustand 상태 업데이트
				set((state) => {
					state.childCodes = validCodes;
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
