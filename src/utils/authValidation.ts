import supabase from "./supabase";
import type { AuthFormFields } from "../types/auth";

/**
 * 인증 시 닉네임 중복 여부를 확인하는 함수
 * @returns Promise<{exists: boolean, error?: string}> - 중복 여부와 에러 메시지 반환
 */
export const checkAuthNicknameDuplicate = async (
	nickname: string,
): Promise<{ exists: boolean; error?: string }> => {
	// 닉네임이 비어있으면 오류 반환
	if (!nickname.trim()) {
		return { exists: false, error: "닉네임을 입력해주세요." };
	}

	// 닉네임 중복 여부 확인
	try {
		const { data, error } = await supabase.functions.invoke(
			"checkNicknameExists",
			{ body: { nickname: nickname.trim() } },
		);

		if (error) throw error;

		// 중복된 닉네임이 있으면 오류 반환
		if (data?.exists) {
			return { exists: true, error: "이미 사용 중인 닉네임입니다." };
		}

		return { exists: false };
	} catch (error) {
		console.error("닉네임 중복 검사 오류:", error);
		return { exists: false, error: "닉네임 중복 검사 실패" };
	}
};

/**
 * 인증 시 자녀 코드 존재 여부를 확인하는 함수
 * @returns Promise<{exists: boolean, childId?: string, error?: string}> - 존재 여부, 자녀 ID, 에러 메시지
 */
export const checkAuthChildCodeExists = async (
	childLinkCode: string,
): Promise<{ exists: boolean; childId?: string; error?: string }> => {
	// 자녀 코드가 비어있으면 오류 반환
	if (!childLinkCode.trim()) {
		return { exists: false, error: "자녀코드를 입력해주세요." };
	}

	// 자녀 코드 존재 여부 확인
	try {
		const { data, error } = await supabase.functions.invoke(
			"getUserIdForChildCode",
			{ body: { childLinkCode: childLinkCode.trim() } },
		);

		if (error) throw error;

		// 존재하지 않는 자녀 코드이면 오류 반환
		if (!data?.exists) {
			return { exists: false, error: "존재하지 않는 자녀 코드입니다." };
		}

		return { exists: true, childId: data.childId };
	} catch (error) {
		console.error("자녀 코드 확인 오류:", error);
		return {
			exists: false,
			error: "자녀 코드 확인 중 오류가 발생했습니다.",
		};
	}
};

/**
 * 인증 폼 이메일 형식 검증
 */
export const validateAuthEmail = (email: string): boolean => {
	return /\S+@\S+\.\S+/.test(email);
};

/**
 * 인증 폼 비밀번호 강도 검증 (최소 8자 이상, 영문자 1개 이상, 숫자 1개 이상)
 */
export const validateAuthPassword = (password: string): boolean => {
	return (
		password.length >= 8 &&
		/[a-zA-Z]/.test(password) &&
		/[0-9]/.test(password)
	);
};

/**
 * 인증 폼 필드 유효성 검사
 */
export const validateAuthForm = (
	fields: AuthFormFields,
): { isValid: boolean; errors: Record<string, string> } => {
	const errors: { [key: string]: string } = {};
	let isValid = true;

	// 이메일 검사
	if (fields.email !== undefined) {
		if (!fields.email.trim()) {
			errors.email = "이메일을 입력해주세요.";
			isValid = false;
		} else if (!validateAuthEmail(fields.email)) {
			errors.email = "올바른 이메일 형식이 아닙니다.";
			isValid = false;
		}
	}

	// 비밀번호 검사
	if (fields.password !== undefined) {
		if (!fields.password.trim()) {
			errors.password = "비밀번호를 입력해주세요.";
			isValid = false;
		} else if (!validateAuthPassword(fields.password)) {
			errors.password =
				"비밀번호는 최소 8자, 영문/숫자 각 1개 이상 포함해야 합니다.";
			isValid = false;
		}
	}

	// 비밀번호 확인 검사
	if (fields.confirmPassword !== undefined) {
		if (!fields.confirmPassword.trim()) {
			errors.confirmPassword = "비밀번호 확인을 입력해주세요.";
			isValid = false;
		} else if (
			fields.password &&
			fields.password !== fields.confirmPassword
		) {
			errors.confirmPassword = "비밀번호가 다릅니다.";
			isValid = false;
		}
	}

	// 닉네임 검사
	if (fields.nickname !== undefined) {
		if (!fields.nickname.trim()) {
			errors.nickname = "닉네임을 입력해주세요.";
			isValid = false;
		}
	}

	// 역할 검사
	if (fields.role !== undefined) {
		if (!fields.role) {
			errors.role = "소속 구분을 선택해주세요.";
			isValid = false;
		}
	}

	// 생년월일 검사
	if (
		fields.year !== undefined &&
		fields.month !== undefined &&
		fields.day !== undefined
	) {
		if (!fields.year || !fields.month || !fields.day) {
			errors.birthDate = "생년월일을 모두 선택해주세요.";
			isValid = false;
		}
	}

	// 선생님 전공 검사
	if (fields.major !== undefined && fields.role === "teacher") {
		if (!fields.major.trim()) {
			errors.major = "주 과목을 입력해주세요.";
			isValid = false;
		}
	}

	// 학부모 자녀코드 검사
	if (fields.childLinkCode !== undefined && fields.role === "parent") {
		if (!fields.childLinkCode.trim()) {
			errors.childLinkCode = "자녀코드를 입력해주세요.";
			isValid = false;
		}
	}

	return { isValid, errors };
};
