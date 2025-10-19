export type UserRole = "" | "student" | "teacher" | "parent";

/**
 * 인증 폼 필드 타입 (모든 필드 optional)
 */
export interface AuthFormFields {
	email?: string;
	password?: string;
	confirmPassword?: string;
	nickname?: string;
	role?: string;
	year?: string;
	month?: string;
	day?: string;
	major?: string;
	childLinkCode?: string;
	birthDate?: string; // 생년월일 통합 필드
}
