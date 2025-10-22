export function getGrade(age: number | null): string | null {
	if (!age) return null;
	if (age >= 8 && age <= 13) return `초등학교 ${age - 7}학년`; // 6살 = 초1
	if (age >= 14 && age <= 16) return `중학교 ${age - 13}학년`; // 13살 = 중1
	if (age >= 17 && age <= 19) return `고등학교 ${age - 16}학년`; // 16살 = 고1
	return "";
}
