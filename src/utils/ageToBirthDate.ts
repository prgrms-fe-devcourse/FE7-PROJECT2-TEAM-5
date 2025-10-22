export function ageToBirthDate(age: number): string {
	const today = new Date();
	const birthYear = today.getFullYear() - age;
	// 생일을 1월 1일로 임시 설정 (정확한 생일 모를 경우)
	return new Date(birthYear, 0, 1).toString();
}
