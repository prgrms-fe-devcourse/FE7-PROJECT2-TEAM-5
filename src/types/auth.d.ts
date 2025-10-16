export type UserRole = "" | "student" | "teacher" | "parent";

export interface AuthForm {
	email: string;
	password: string;
	confirmPassword: string;
	nickname: string;
	role: string;
	birthDate: string;
	major: string;
}

export interface StudentProfileUpdateForm {
	nickname: string;
	role: string;
	birthDate: string;
	major: string;
}
export interface TeacherProfileUpdateForm {
	nickname: string;
	role: string;
	birthDate: string;
	major: string;
}
export interface ParentProfileUpdateForm {
	nickname: string;
	role: string;
	birthDate: string;
	major: string;
}
